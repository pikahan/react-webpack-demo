const path = require("path")
const webpack = require("webpack")

module.exports = {
  entry: {
    vendor: ['react','react-dom'] // 需要打包的模块
  },
  output: {
    path: path.resolve(__dirname, 'static/js'),
    filename: '[name].dll.js',
    library: '[name]_library' // 注意与webpack.DllPlugin中的name保持一致。
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '[name]-manifest.json'),
      name: '[name]_library',
      context: __dirname
    })
  ]
};
