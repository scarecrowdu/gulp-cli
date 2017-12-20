## 基于gulp搭建的前端自动化构建

**适用于中小型项目，快速构建前端项目框架。比如运营活动页，官网类，简单移动端项目，小demo测试等**

## 项目启动
```
// 常用命令
开发环境： npm run dev
生产环境： npm run build

// 单任务命令
执行压缩： gulp zip
编译页面： gulp html
编译脚本： gulp script
编译样式： gulp styles
语法检测： gulp eslint
压缩图片： gulp images
```

## [项目地址](https://github.com/vincentSea/gulp-cli)
* 如对你有帮助，希望给个Star ！哈哈哈！！
```
git clone https://github.com/vincentSea/gulp-cli.git
```

## 项目目录
```
├── README.md         # 项目说明
├── config            # gulp路径配置
├── dist              # 打包路径
|
├── gulpfile.js       # gulp配置文件
├── package.json      # 依赖包
|
├── src               # 项目文件夹
│   ├── include       # 公用页面引入
│   ├── index.html    # 首页
│   ├── static        # 资源文件夹
│   │   ├── images    # 图库
│   │   ├── js        # 脚本
│   │   └── styles    # 样式（scss, css）
│   └── views         # 页面
|
├── static            # 打包到dist中static文件中
└── webpack.config.js # webpack配置文件
```

## 项目约定
1、 使用严格的 eslint 规范 [文档链接](https://github.com/airbnb/javascript)
* 如果不想使用eslint，可以gulpfile文件中去掉该任务

2、使用scss预处理
* 可以根据个人喜好，去配置不同的预处理工具

3、static文件夹
* 一级目录中static文件夹，可以存放不需要编译的文件内容，比如一些插件，图片，字体文件等
* 每次npm run dev or build 都会把static文件夹下的内容，打包到dist/static里


## 代理模式
* config/index.js文件中配置

**例子如下**
``` javascript
 middleware: [
  proxy.proxyPrase(
    {
      target: 'http://v3.wufazhuce.com:8000/api',
      route: '/api'
    }
  )
]
```

## 使用Eslint 
config/index.js文件
```
useEslint: false // 是否启用eslint
```

## 使用webpack
* 集成webpack功能，可以自行选择

config/index.js文件
```
useWebpack: false // 是否启用webpack
```

## 小生后话
* 此前端自动化构建框架，只是为了简单方便

* 可以随便根据自己的要求去进行修改配置

* 如有设计不合理地方，可以提出，我乃虚心听取

* [项目地址](https://github.com/vincentSea/gulp-cli) 如对你有帮助，希望给个Star ！哈哈哈！！


