const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const srcDir = path.resolve(process.cwd(), './src/static/')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

function getEntry() {
    var jsPath = path.resolve(srcDir, 'js')
    var dirs = fs.readdirSync(jsPath)
    var matchs = []
    var files = {}
    dirs.forEach((item) => {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
          files[matchs[1]] = path.resolve(srcDir, 'js', item)
        }
    })
    // console.log(JSON.stringify(files))
    return files
}

module.exports = {
  cache: true,
  entry: getEntry(),

  output: {
    path: __dirname + '/dist/static/',
    filename: '[name].js',
  },


  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src')
    }
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader'},
          'postcss-loader'
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]?[hash]',
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  }
}

