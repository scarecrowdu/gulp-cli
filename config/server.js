const proxy = require('./poxy')

module.exports = {
  // 服务器
  server: {
    baseDir: './dist',
    middleware: [
      // proxy.proxyPrase(
      //   {
      //     target: 'http://v3.wufazhuce.com:8000/api',
      //     route: '/api'
      //   }
      // )
    ]
  },
  // 是否开启多端同步
  ghostMode: {
    click: false, // 同步点击
    scroll: false // 同步滚动
  },
  // 再控制台打印前缀
  // logPrefix: 'browserSync in gulp',
  // 运行后自动打开的；浏览器 （不填默认则是系统设置的默认浏览器）
  browser: ['chrome'],
  // 自动打开浏览器
  open: false,
  // 使用端口`
  port: '8080'
}
