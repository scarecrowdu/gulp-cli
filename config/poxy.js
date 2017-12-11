const url = require('url')
const proxy = require('proxy-middleware')

exports.proxyPrase = function(data) {
  let proxyOptions
  if (data.target) {
    proxyOptions = url.parse(data.target)
    proxyOptions.route = data.route

    return proxy(proxyOptions)
  }

  return ''
}

