module.exports = {
    // 端口号设置
    port: 9090,
    // 代理请求设置
    proxyTable: {
        // 代理ip
        target: 'http://0.0.0.1',
        // 代理ip接口名字
        inner: 'inner'
    }
};
