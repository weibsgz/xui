// 打包公共类库
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const rules = require("./webpack.rules.conf.js")
module.exports = {
  mode: 'production',
  entry: {
    utils: './src/assets/js/utils.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist/js'),
    publicPath: './',
    filename: 'utils.min.js',
    library: 'xUtils',
    libraryTarget: 'umd'
  },
  module: {
    rules: [...rules]
  },
  plugins: [
    //上线压缩
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_debugger: false,
          drop_console: true
        }
      }
    })
  ]
}