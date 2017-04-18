// 存放未编译的文件夹
const ROOT_DEV ='src';
// 存放编译过后的文件夹
const ROOT_BUILD ='build';
// 存放打包后的文件夹    
const ROOT_ZIP ='zip';


module.exports = {
    // 端口号设置
    port: 9090,
    
    // 代理请求设置
    proxyTable: {
        // 代理ip
        target: 'http://0.0.0.1',
        // 代理ip接口名字
        inner: 'inner'
    },

    rootDev: ROOT_DEV,
    rootBuild: ROOT_BUILD,
    rootZip: ROOT_ZIP,

    // 未编译的路径
    dev: {
        html : ROOT_DEV + '/**/*.html',
        css  : ROOT_DEV + '/assets/css/*.{scss,css}',
        scss : ROOT_DEV + '/assets/css/**/*.scss',
        js   : ROOT_DEV + '/assets/js/**/*.js',
        lib  : ROOT_DEV + '/assets/lib/**/*',
        image: [ROOT_DEV + '/assets/images/**/*.{png,jpg,gif,ico}', '!'+ ROOT_DEV + '/assets/images/sprite/**/'],
        tpl  : ROOT_DEV + '/**/*.tpl',
    },

    // 编译过后的路径
    build: {
        html : ROOT_BUILD + '',
        css  : ROOT_BUILD + '/assets/css/',
        js   : ROOT_BUILD + '/assets/js/',
        lib  : ROOT_BUILD + '/assets/lib/',
        image: ROOT_BUILD + '/assets/images/',
        zip  : ROOT_BUILD + '/**/*'
    },

    // 雪碧图
    sprite: ROOT_DEV + '/assets/images/sprite'
};

