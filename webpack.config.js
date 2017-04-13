var glob = require('glob');
var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

/**
 * 获取assets/js文件下的.es6.js文件
 * @return {[type]} [description]
 */
// function getEntry() {
//     var entry = {};
//     glob.sync(__dirname + '/src/assets/js/*.js').forEach(function(name) {
//         var n = name.match(/([^/]+?)\.js/)[1];
//         // var key = n.split('.es6')[0];
//         entry[n] = __dirname + '/src/assets/js/' + n + '.js';
//     });
//     return entry;
// }

var fs = require('fs');
var srcDir = path.resolve(process.cwd(), 'src/assets');

// 获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    var jsPath = path.resolve(srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [],
        files = {};
    dirs.forEach(function(item) {
        matchs = item.match(/(.+)\.js$/);
        // console.log(matchs);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js', item);
        }
    });
    // console.log(JSON.stringify(files));
    return files;
}


module.exports = {
    cache: true,
    refreshEntry: function() {
        this.entry = getEntry();
    },
    entry: getEntry(),
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel?presets=es2015',
            exclude: /node_modules/
        }]
    },
    resolve: {},
    plugins: [
        new CommonsChunkPlugin('bundle.js'),
        // new webpack.optimize.UglifyJsPlugin(),
    ],
    // devtool: 'source-map',
    output: {
        path: __dirname + '/build/assets/',
        filename: '[name].js',
        // sourceMapFilename: '[file].map'
    }
};
