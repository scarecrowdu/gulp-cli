var gulp = require('gulp');
var sass = require('gulp-sass'); // sass的编译
var autoprefixer = require('gulp-autoprefixer'); // 自动添加css前缀
var minifycss = require('gulp-minify-css'); // 压缩css一行
var uglify = require('gulp-uglify'); // 压缩js代码
var notify = require('gulp-notify'); // 加控制台文字描述用的
var clean = require('gulp-clean'); // 清理文件
var fileinclude = require('gulp-file-include'); // include 文件用
var imagemin = require('gulp-imagemin'); // 图片压缩
var pngquant = require('imagemin-pngquant'); // 图片无损压缩
var cache = require('gulp-cache'); // 检测文件是否更改
var zip = require('gulp-zip'); // 自动打包并按时间重命名
var htmlmin = require('gulp-htmlmin'); // 压缩html
var mergeStream = require('merge-stream'); // 合并多个 stream
var gutil = require('gulp-util'); // 打印日志 log
var plumber = require('gulp-plumber'); // 监控错误
var babel = require('gulp-babel'); // 编译ES6
var gulpif = require('gulp-if'); // 条件判断
var minimist = require('minimist');
var gulpSequence = require('gulp-sequence'); // 顺序执行

var eslint = require('gulp-eslint'); // 代码风格检测工具

var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');

var url = require('url');
var proxy = require('proxy-middleware');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var knownOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'development'
    }
};
var options = minimist(process.argv.slice(2), knownOptions);

// 代理请求的ip+项目名
var proxyUrl = {
    ip: 'http://192.168.1.250',
    route: '/mBet'
};

// 项目目录
var Root = {
    dev: 'src',
    build: 'build',
    zip: 'zip'
};
// 未编译的路径
var devPath = {
    html: Root.dev + '/**/*.html',
    css: Root.dev + '/assets/css/*.scss',
    scss: Root.dev + '/assets/css/**/*.scss',
    js: Root.dev + '/assets/js/**/*.js',
    lib: Root.dev + '/assets/lib/**/*',
    image: Root.dev + '/assets/images/**/*.{png,jpg,gif,ico}',
    tpl: Root.dev + '/**/*.tpl'
};
// 编译的路径
var buildPath = {
    html: Root.build + '',
    css: Root.build + '/assets/css/',
    js: Root.build + '/assets/js/',
    lib: Root.build + '/assets/lib/',
    image: Root.build + '/assets/images/',
    zip: Root.build + '/**/*'
};

/**
 * 改变文件 输出log
 * @param {any} event
 */
function watchFile(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
};

var ci = false;


/**
 * 错误输出
 * @param {any} err
 */
function onError(err) {
    if (ci) {
        // stop in CI
        process.exit(1);
    } else {
        // keep going in non-CI
        gutil.log(err);
        gutil.beep();
        this.emit('end');
    }
}


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

    gulp
        .src([devPath.html, '!*.tpl'], { base: Root.dev })
        .pipe(plumber())
        .pipe(fileinclude({ prefix: '@@', basepath: '@file' }))
        .pipe(gulpif(options.env === 'production', htmlmin(optionsSet)))
        .pipe(gulp.dest(buildPath.html))
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
        .src(devPath.css)
        .pipe(plumber(function(error) {
            gutil.log(error);
            gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
            this.emit('end');
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulpif(options.env === 'production', minifycss()))
        .pipe(gulp.dest(buildPath.css))
        .pipe(reload({ stream: true }));
});

/* js 压缩 */
gulp.task('jsmin', function() {
    // elinst
    var lint = gulp
        .src([devPath.js, '!node_modules/**'])
        .pipe(plumber())
        .pipe(eslint({ configFle: './.eslintrc' }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .on('error', onError);

    // js
    var jsmin = gulp
        .src([devPath.js, '!node_modules/**'])
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015'],
            plugins: [
                //     // es2015 - based off of v6.3.13
                //     // https://github.com/babel/babel/tree/master/packages
                //     [
                //         require('babel-plugin-transform-es2015-template-literals'), {
                //             loose: true
                //         }
                //     ],
                //     require('babel-plugin-transform-es2015-literals'),
                //     require('babel-plugin-transform-es2015-function-name'),
                //     require('babel-plugin-transform-es2015-arrow-functions'),
                //     require('babel-plugin-transform-es2015-block-scoped-functions'),
                [require('babel-plugin-transform-es2015-classes'), { loose: true }],
                require('babel-plugin-transform-es2015-object-super'),
                require('babel-plugin-syntax-export-extensions'),
                //     require('babel-plugin-transform-es2015-shorthand-properties'),
                //     require('babel-plugin-transform-es2015-computed-properties'),
                //     [
                //         require('babel-plugin-transform-es2015-for-of'), {
                //             loose: true
                //         }
                //     ],
                //     require('babel-plugin-transform-es2015-sticky-regex'),
                //     require('babel-plugin-transform-es2015-unicode-regex'),
                //     require('babel-plugin-check-es2015-constants'),
                //     require('babel-plugin-transform-es2015-spread'),
                //     require('babel-plugin-transform-es2015-parameters'),
                //     require('babel-plugin-transform-es2015-destructuring'),
                //     require('babel-plugin-transform-es2015-block-scoping'),
                //     require('babel-plugin-transform-es2015-typeof-symbol'),
                //     require('babel-plugin-transform-es2015-modules-commonjs'),
                [
                    require('babel-plugin-transform-regenerator'), {
                        async: false,
                        asyncGenerators: false
                    }
                ],
                //     // compatibility
                require('babel-plugin-transform-object-assign'),
                require('babel-plugin-transform-es3-member-expression-literals'),
                require('babel-plugin-transform-es3-property-literals'),
                // require('babel-plugin-transform-jscript'),
                // require('babel-plugin-transform-undefined-to-void')
            ]
        }))
        // .pipe(webpack( webpackConfig ))
        .pipe(gulpif(options.env === 'production', uglify())) // 仅在生产环境时候进行压缩
        .pipe(gulp.dest(buildPath.js))
        .pipe(reload({ stream: true }));


    // lib 插件
    // var libmin = gulp
    //     .src(devPath.lib)
    //     .pipe(plumber())
    //     .pipe(gulp.dest(buildPath.lib))
    //     .pipe(reload({stream: true}))

    return mergeStream(lint, jsmin);
});

gulp.task('libmin', function() {
    // lib 插件
    return gulp
        .src(devPath.lib)
        .pipe(plumber())
        .pipe(gulp.dest(buildPath.lib))
        .pipe(reload({ stream: true }));
});

/* webpack */
gulp.task('webpack', function() {
    webpackConfig.refreshEntry();
    return gulp
        .src([devPath.js])
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(buildPath.js));
});

/* images 压缩 */
gulp.task('images', () => {
    gulp
        .src(devPath.image)
        .pipe(plumber())
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(buildPath.image))
        .pipe(reload({ stream: true }));
});

/* clean 清除*/
gulp.task('clean', function() {
    return gulp
        .src(Root.build, { read: false })
        .pipe(clean())
        .pipe(notify({ message: 'Clean task complete' }));
});

/* 打包压缩包 */
gulp.task('zip', function() {

    /**
     * 补零
     * @param {any} i
     * @returns
     */
    function checkTime(i) {
        if (i < 10) {
            i = '0' + i;
        }
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
        .src(buildPath.zip)
        .pipe(plumber())
        .pipe(zip(build))
        .pipe(gulp.dest(Root.zip))
        .pipe(notify({ message: 'Zip task complete' }));
});

/* watch文件 */
gulp.task('watch', function() {
    // 看守所有.tpl文件
    gulp
        .watch(devPath.tpl, ['htmlmin'])
        .on('change', function(event) {
            watchFile(event);
        });
    // 看守所有.html文件
    gulp
        .watch(devPath.html, ['htmlmin'])
        .on('change', function(event) {
            watchFile(event);
        });
    // 看守所有.scss文件
    gulp
        .watch(devPath.scss, ['cssmin'])
        .on('change', function(event) {
            watchFile(event);
        });
    // 看守所有.js文件
    gulp
        .watch(devPath.js, ['jsmin'])
        .on('change', function(event) {
            watchFile(event);
        });
    gulp
        .watch(devPath.lib, ['libmin'])
        .on('change', function(event) {
            watchFile(event);
        });
    // 看守所有图片文件
    gulp
        .watch(devPath.image, ['images'])
        .on('change', function(event) {
            watchFile(event);
        });

    gutil.log(gutil.colors.green('message：watch任务-监测改动的文件'));
});

/** 静态服务器 */
gulp.task('server', ['clean'], function() {

    gulpSequence([
        'cssmin', 'images', 'htmlmin', 'jsmin', 'libmin'
    ], function() {

        gutil.log(gutil.colors.green('启动本地服务器'));
        gutil.log(gutil.colors.green('代理请求地址：' + proxyUrl.ip));
        gutil.log(gutil.colors.green('代理请求项目：' + proxyUrl.route));

        // var files = [buildPath.html, buildPath.css, buildPath.js, buildPath.image];
        var proxyOptions = url.parse(proxyUrl.ip + proxyUrl.route);
        proxyOptions.route = proxyUrl.route;

        browserSync.init({ // 初始化 BrowserSync
            injectChanges: true, // 插入更改
            files: [
                '*.html', '*.css', '*.js'
            ], // 监听文件类型来自动刷新
            server: {
                baseDir: Root.build, // 目录位置
                middleware: [proxy(proxyOptions)] // 代理设置
            },
            ghostMode: { // 是否开启多端同步
                click: true, // 同步点击
                scroll: true // 同步滚动
            },
            logPrefix: 'browserSync in gulp', // 再控制台打印前缀
            // browser: ["chrome"], //运行后自动打开的；浏览器 （不填默认则是系统设置的默认浏览器）
            open: true, //       自动打开浏览器
            port: 8080 // 使用端口
        });

        // 监听watch
        gulp.start('watch');
        // gulp.watch(['src/**']).on('change', function(file) {
        //     console.log(file)
        // });

    });

});

/* 打包 输入命令：npm run build 或者 gulp build --env production */
gulp.task('build', ['clean'], function() {
    gulpSequence([
        'cssmin', 'images', 'htmlmin', 'jsmin', 'libmin'
    ], function() {
        gulp.start('zip');
        gutil.log(gutil.colors.green('message：项目已经打包完成'));
    });
});

/* 任务命令 */
gulp.task('default', function() {
    gutil.log(gutil.colors.green('开发环境：         npm run dev 或者 gulp server'));
    gutil.log(gutil.colors.green('打包项目：         npm run build 或者 gulp build --env production'));
    gutil.log(gutil.colors.green('删除上线文件夹：    gulp clean'));
    gutil.log(gutil.colors.green('js代码压缩：       gulp jsmin'));
    gutil.log(gutil.colors.green('css代码压缩：      gulp cssmin'));
    gutil.log(gutil.colors.green('html代码压缩：     gulp htmlmin'));
    gutil.log(gutil.colors.green('图片压缩：         gulp images'));
    gutil.log(gutil.colors.green('监听文件：         gulp watch'));
});
