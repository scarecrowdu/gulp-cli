## gulp搭建前端项目

使用gulp前端自动化构建工具搭建前端项目，作为初始化项目

#### 初识 gulp

<table><tr><td bgcolor=#cf4646>
    ![](http://www.gulpjs.com.cn/img/gulp-white-text.svg)
</td></tr></table>

简介：<br />
 gulp是前端开发过程中对代码进行构建的工具，是自动化项目的构建利器；她不仅能对网站资源进行优化，而且在开发过程中很多重复的任务能够使用正确的工具自动完成；使用她，我们不仅可以很愉快的编写代码，而且大大提高我们的工作效率。

<!--more-->
  gulp是基于Nodejs的自动任务运行器， 她能自动化地完成 javascript/coffee/sass/less/html/image/css 等文件的的测试、检查、合并、压缩、格式化、浏览器自动刷新、部署文件生成，并监听文件在改动后重复指定的这些步骤。在实现上，她借鉴了Unix操作系统的管道（pipe）思想，前一级的输出，直接变成后一级的输入，使得在操作上非常简单。通过本文，我们将学习如何使用Gulp来改变开发流程，从而使开发更加快速高效。

  gulp 和 grunt 非常类似，但相比于 grunt 的频繁 IO 操作，gulp 的流操作，能更快地更便捷地完成构建工作。

 [Gulp 中文网站](http://www.gulpjs.com.cn/)

 [gulp详细入门教程](http://www.ydcss.com/archives/18) （这个详细入门教程写的很好，建议没有了解gulp的人去看看！） --来自于http://www.ydcss.com/


#### gulp 安装

1. 安装[Nodejs](https://nodejs.org/en/)，在这里我使用的是v6.9.1的版本

2. npm介绍

   ![img](img/02.png)  


3. 选装[cnpm](http://npm.taobao.org) （因为npm安装插件是从国外服务器下载，受网络影响大，这里建议使用cnpm）

   3.1 安装cnpm
   ```bash
   $ npm install -g cnpm --registry=https://registry.npm.taobao.org
   ```

   3.2 使用方式 （跟npm使用方式一样）
   ```bash
     $ cnpm install <name> [-g] [--save-dev]
   ```

- - -

#### cmd命令小技巧

```
创建空文件夹  mkdir name  name是文件夹名称
创建空文件    cd.> name.txt
删除文件夹    rd/s/q name name是文件夹名称 （物理删除）
tree命令     tree /f     显示树形结构
             tree /f > tree.txt    导出目录
```

#### 全局安装gulp
  ```bash
  $ cnpm install gulp -g
  ```
  查看是否正确安装：命令提示符执行gulp -v

#### 创建项目

```bash
$ mkdikr gulp-demo
$ cd gulp-demo
$ cnpm init
```
说明：package.json是基于nodejs项目必不可少的配置文件，它是存放在项目根目录的普通json文件；


#### 目录结构
```bash
│  gulpfile.js       //gulp配置文件
│  package.json      //package.json  配置文件
│  README.MD         //说明
│  tree.txt
│  
├─build              //线上项目 或者 开发环境项目            
├─node_modules 
└─src                //项目主目录
    │  index.html
    │  
    ├─assets         //资源文件  
    │  ├─css
    │  ├─images
    │  ├─js
    │  └─lib
    └─page           //页面文件
    │  └─home.html
```


#### 任务命令
```bash
开发环境：         npm run dev 或者 gulp server
打包项目：         npm run build 或者 gulp build --env production
打包成压缩包:      npm run zip  或者 gulp zip
删除上线项目:      gulp clean
js代码压缩：       gulp jsmin
css代码压缩：      gulp cssmin
html代码压缩：     gulp htmlmin
图片压缩：         gulp images
监听文件：         gulp watch
```
