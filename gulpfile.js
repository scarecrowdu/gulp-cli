/**
 * gulp 自动化构建工具
 * gulpfile.js 配置文件
 * 
 */
var gulp          = require('gulp');
var sass          = require('gulp-sass'); // sass的编译
var autoprefixer  = require('gulp-autoprefixer'); // 自动添加css前缀
var minifycss     = require('gulp-minify-css'); // 压缩css一行
var uglify        = require('gulp-uglify'); // 压缩js代码
var notify        = require('gulp-notify'); // 加控制台文字描述用的
var clean         = require('gulp-clean'); // 清理文件
var fileinclude   = require('gulp-file-include'); // include 文件用
var imagemin      = require('gulp-imagemin'); // 图片压缩
var pngquant      = require('imagemin-pngquant'); // 图片无损压缩
var cache         = require('gulp-cache'); // 检测文件是否更改
var zip           = require('gulp-zip'); // 自动打包并按时间重命名
var htmlmin       = require('gulp-htmlmin'); // 压缩html
var mergeStream   = require('merge-stream'); // 合并多个 stream
var gutil         = require('gulp-util'); // 打印日志 log
var plumber       = require('gulp-plumber'); // 监控错误
var babel         = require('gulp-babel'); // 编译ES6
var gulpif        = require('gulp-if'); // 条件判断
var minimist      = require('minimist');
var gulpSequence  = require('gulp-sequence'); // 顺序执行
var eslint        = require('gulp-eslint'); // 代码风格检测工具
var del           = require('del'); // 删除文件

// 结合webpack
var webpack       = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');

// 静态服务器和代理请求
var url           = require('url');
var proxy         = require('proxy-middleware');
var browserSync   = require('browser-sync');
var reload        = browserSync.reload;

// 代理请求 / 端口设置 / 编译路径
var config = require('./config.js');

// 区分开发和生产环境
var knownOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'development'
    }
};
var options = minimist(process.argv.slice(2), knownOptions);

/**
 * 开发环境和生产环境
 * 先清空原先文件夹，在执行编译或者打包
 * 
 * @param {any} cb 回调
 */
var cnEnvironment = function(cb) {

   // 先执行清空文件夹内容
   del(config.rootBuild).then(paths => {
        // 通知信息
        gutil.log(gutil.colors.green('Message：Delete complete!'));
        gutil.log(gutil.colors.green('Message：Deleted files and folders:', paths.join('\n')));
        
        // 执行项目打包
        gulpSequence([
            'cssmin', 'images', 'htmlmin', 'jsmin', 'libmin'
        ], function() {

            gutil.log(gutil.colors.green('Message：Compile finished!'));
            // 执行回调
            cb &&　cb();

        });
    });
}

/**
 * 错误输出
 * 
 * @param {any} error 
 */
var onError = function(error){
    var title = error.plugin + ' ' + error.name;
    var msg = error.message;
    var errContent = msg.replace(/\n/g, '\\A '); // replace to `\A`, `\n` is not allowed in css content

    // system notification
    notify.onError({
        title: title,
        message: errContent, 
        sound: true
    })(error);
    
    // prevent gulp process exit
    this.emit('end');
};

/* html 打包*/
gulp.task('htmlmin', function() {
    var optionsSet = {
        removeComments: true, // 清除HTML注释
        collapseWhitespace: true, // 压缩HTML
        collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false, // 删除<style>和<link>的type="text/css"
        minifyJS: true, // 压缩页面JS
        minifyCSS: true // 压缩页面CSS
    };

    return gulp
        .src([config.dev.html, '!*.tpl'], { base: config.rootDev })
        .pipe(plumber(onError))
        .pipe(fileinclude({
            prefix: '@@', 
            basepath: '@file'
         }))
        .pipe(gulpif(options.env === 'production', htmlmin(optionsSet)))
        .pipe(gulp.dest(config.build.html))
        .pipe(reload({ stream: true }));
});

/* css 压缩 */
gulp.task('cssmin', function() {
    var AUTOPREFIXER_BROWSERS = [
        'last 6 version',
        'ie >= 6',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.0',
        'bb >= 10'
    ];

    return gulp
        .src(config.dev.css)
        .pipe(plumber(onError))
        .pipe(sass())
        // .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulpif(options.env === 'production', minifycss()))
        .pipe(gulp.dest(config.build.css))
        .pipe(reload({ stream: true }));
});

/* eslint 语法检查 */
gulp.task('eslint', function() {
   return gulp
    .src([config.dev.js, '!node_modules/**'])
    .pipe(plumber(onError))
    .pipe(eslint({ configFle: './.eslintrc' }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}) 

/* js 压缩 */
gulp.task('jsmin', ['eslint'], function() {
    var jsmin = gulp
        .src([config.dev.js, '!node_modules/**'])
        .pipe(plumber(onError))
        .pipe(babel({
            presets: ['es2015'],
            plugins: [
                // es2015 - based off of v6.3.13
                // https://github.com/babel/babel/tree/master/packages
                require('babel-plugin-transform-es2015-object-super'),
                require('babel-plugin-syntax-export-extensions'),
                require('babel-plugin-transform-object-assign'),
                require('babel-plugin-transform-es3-member-expression-literals'),
                require('babel-plugin-transform-es3-property-literals'),
                [require('babel-plugin-transform-es2015-classes'), { loose: true }],
                [require('babel-plugin-transform-regenerator'), { async: false, asyncGenerators: false }],
            ]
        }))
        // .pipe(webpack( webpackConfig ))
        .pipe(gulpif(options.env === 'production', uglify())) // 仅在生产环境时候进行压缩
        .pipe(gulp.dest(config.build.js))
        .pipe(reload({ stream: true }));

    return mergeStream(jsmin);
});

/* js 插件 */
gulp.task('libmin', function() {
    // lib 插件
    return gulp
        .src(config.dev.lib)
        .pipe(plumber(onError))
        .pipe(gulp.dest(config.build.lib))
        .pipe(reload({ stream: true }));
});

/* webpack */
gulp.task('webpack', function() {
    webpackConfig.refreshEntry();
    return gulp
        .src([config.dev.js])
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(config.build.js));
});

/* images 压缩 */
gulp.task('images', () => {
    return gulp
        .src(config.dev.image)
        .pipe(plumber(onError))
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(config.build.image))
        .pipe(reload({ stream: true }));
});

/* clean 清除*/
gulp.task('clean', function() {
    // return gulp
    //     .src(config.rootBuild, { read: false })
    //     .pipe(clean())
    //     .pipe(notify({ message: 'Clean task complete' }));
    del(config.rootBuild).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});

/* zip 压缩包 */
gulp.task('zip', function() {
    /**
     * 补零
     * @param {any} i
     * @returns
     */
    function checkTime(i) {
        if (i < 10) { i = '0' + i; }
        return i;
    }

    var d = new Date();
    var year = d.getFullYear();
    var month = checkTime(d.getMonth() + 1);
    var day = checkTime(d.getDate());
    var hour = checkTime(d.getHours());
    var minute = checkTime(d.getMinutes());

    var time = String(year) + String(month) + String(day) + String(hour) + String(minute);
    var build = 'build-' + time + '.zip';
    
    return gulp
        .src(config.build.zip)
        .pipe(plumber(onError))
        .pipe(zip(build))
        .pipe(gulp.dest(config.rootZip))
        .pipe(notify({ message: 'Zip task complete' }));
});

/* watch 文件 */
gulp.task('watch', function() {
    // 看守所有.tpl文件
    gulp.watch(config.dev.tpl, ['htmlmin'])
    // 看守所有.html文件
    gulp.watch(config.dev.html, ['htmlmin'])
    // 看守所有.scss文件
    gulp.watch(config.dev.scss, ['cssmin'])
    // 看守所有.js文件
    gulp.watch(config.dev.js, ['jsmin'])
    // 看守所有js插件文件
    gulp.watch(config.dev.lib, ['libmin'])
    // 看守所有图片文件
    gulp.watch(config.dev.image, ['images'])
});

/* server 服务器 */
gulp.task('server', function() {

   cnEnvironment(function(){
        gutil.log(gutil.colors.green('启动本地服务器'));
        gutil.log(gutil.colors.green('代理请求地址：' + config.proxyTable.target));
        gutil.log(gutil.colors.green('代理请求项目：' + config.proxyTable.inner));

        var proxyOptions = url.parse(config.proxyTable.target + config.proxyTable.inner);
        proxyOptions.route = config.proxyTable.inner;

        browserSync.init({ // 初始化 BrowserSync
            injectChanges: true, // 插入更改
            files: [
                '*.html', '*.css', '*.js'
            ], // 监听文件类型来自动刷新
            server: {
                baseDir: config.rootBuild, // 目录位置
                middleware: [proxy(proxyOptions)] // 代理设置
            },
            ghostMode: { // 是否开启多端同步
                click: true, // 同步点击
                scroll: true // 同步滚动
            },
            logPrefix: 'browserSync in gulp', // 再控制台打印前缀
            browser: ["chrome"], //运行后自动打开的；浏览器 （不填默认则是系统设置的默认浏览器）
            open: true, //       自动打开浏览器
            port: config.port   // 使用端口
        });

        // 监听watch
        gulp.start('watch');
    });

});

/* build 打包项目 */
gulp.task('build', function() {
    cnEnvironment(function(){
        gulp.start('zip', function(){
           gutil.log(gutil.colors.green('Message：Project package is complete'));
        });
    })
});

/* 任务命令 */
gulp.task('default', function() {
    gutil.log(gutil.colors.green('开发环境：          npm run dev 或者 gulp server'));
    gutil.log(gutil.colors.green('打包项目：          npm run build 或者 gulp build --env production'));
    gutil.log(gutil.colors.green('删除文件夹：        gulp clean'));
    gutil.log(gutil.colors.green('编译js代码：        gulp jsmin'));
    gutil.log(gutil.colors.green('编译css代码：       gulp cssmin'));
    gutil.log(gutil.colors.green('编译html代码：      gulp htmlmin'));
    gutil.log(gutil.colors.green('编译图片压缩：      gulp images'));
    gutil.log(gutil.colors.green('监听所有文件：      gulp watch'));
});
