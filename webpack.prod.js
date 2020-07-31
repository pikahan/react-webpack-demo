const { merge } = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpackCommonConfig = require('./webpack.common')
const { distPath, srcPath } = require('./path')

module.exports = merge(webpackCommonConfig, {
  mode: 'production',
  entry: {
    index: path.join(srcPath, 'index')
  },
  output: {
    filename: '[name].[contentHash:8].js', // contentHash是针对文件级别的hash 有助于缓存,
    path: distPath
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'url-loader', // 生产环境用url-loader, 让较小的图片转换成base64格式
            options: {
              limit: 8192, // 1024 * 8: 8kb以下的图片将转换为base64加载,
              outputPath: '/image/',
              // publicPath: '' // 可以设置图片的cdn地址
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 在指定路径生成一个html文件, 将打包好的js自动插入到body中
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      chunks: ['index', 'vendor', 'common']
    }),
    new CleanWebpackPlugin(), // 每次构建自动清除/dist下的文件
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new MiniCssExtractPlugin({ // 抽离css
      filename: 'css/main.[contentHash:8].css'
    }),
    new WebpackParallelUglifyPlugin({
      uglifyJS: {
        output: {
          beautify: false, // 最紧凑的输出
          comments: false, // 删除所有的注释
        },
        compress: {
          drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
          collapse_vars: true, // 内嵌定义了但是只用到一次的变量
          reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
        }
      }
    })
  ],

  optimization: {
    minimizer: [
      new TerserWebpackPlugin({}), // 压缩JS
      new OptimizeCssAssetsWebpackPlugin({}) // 压缩CSS,

    ],
    splitChunks: {
      chunks: 'all', // all表示动态模块和非动态模块都进行拆分打包
      // // 分组 其实也不用配置, 默认配置已经配置好了, 具有差不多的效果
      // cacheGroups: {
      //
      //   // 第三方模块
      //   vendor: {
      //     name: 'vendor',
      //     priority: 1,
      //     test: /node_modules/,
      //     minChunks: 1, // 最少复用过几次
      //   },
      //
      //   // 公共模块
      //   common: {
      //     name: 'common',
      //     priority: 0,
      //     minChunks: 2, // 最少复用过几次
      //   }
      // }
    }
  }
})