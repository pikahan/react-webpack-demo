const path = require('path')
const { merge } = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackCommonConfig = require('./webpack.common')
const { distPath, srcPath } = require('./path')

module.exports = merge(webpackCommonConfig, {
  entry: {
    index: ['react-hot-loader/patch', path.join(srcPath, 'index')]
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/, // 开发环境图片可以直接用file-loader来搞定
        loader: 'file-loader'
      }
    ]
  },
  devServer: {
    port: 8080,
    hot: true,
    progress: true,  // 显示进度条
    contentBase: distPath,
    open: true,  // 自动打开浏览器
    compress: true,  // 压缩
    // proxy: {} 可以在这里设置代理转发
  },
  plugins: [
    // 在指定路径生成一个html文件, 将打包好的js自动插入到body中
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index-dev.html'),
      name: 'index.html',
      chunks: ['index', 'vendor', 'common']
    }),
    // 相当于一个全局变量, 常用于根据生成开发环境来设置接口地址等
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor-manifest.json')
    }),
    new CopyWebpackPlugin({ // 拷贝生成的文件到dist目录 这样每次不必手动去cv
      patterns: [{
        from: path.resolve(__dirname, './static'),
        to: path.resolve(__dirname, './dist/static')
      }]
    }),
    new BundleAnalyzerPlugin()
  ],
})