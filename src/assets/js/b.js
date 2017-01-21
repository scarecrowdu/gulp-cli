define([jquery],function(require, exports) { 
  // 获取模块 a 的接口 
  var a = require('./a'); 
  // 调用模块 a 的方法 
  a.doSomething();
});