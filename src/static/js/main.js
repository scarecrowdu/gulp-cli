

var Zepto = (function () {
  var zepto = {}, $

  function Z(doms) {
    var len = doms.length 
    for (var i = 0; i < len; i++) {
      this[i] = doms[i]
    }
    this.length = doms.length
  }

  zepto.Z = function(doms) {
    return new Z(doms)
  }

  zepto.init = function(doms) {
    var doms = ['domObj1','domObj2','domObj3']
    return zepto.Z(doms)
  }

  $ = function() {
    return zepto.init()
  }

  $.fn = {
    constructor: zepto.Z,
    method: function() {
      return this
    }
  }

  zepto.Z.prototype = Z.prototype = $.fn

  return $
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)

console.log($().method());