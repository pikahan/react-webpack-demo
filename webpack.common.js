const HappyPack = require('happypack')
const { srcPath } = require('./path')


module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        loader: 'happypack/loader?id=babel',
        include: srcPath
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader', 'postcss-loader'] // postcss-loader: 添加浏览器前缀等(注意别忘了postcss.config.js进行配置), css-loader: 合并多个css, style-loader: 将css挂载到head中的style标签里
      },
      {
        test: /\.s[ac]ss$/,
        loader: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'] // 注意顺序, loader加载是从后往前的
      }
    ]
  },
  plugins: [


    new HappyPack({
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory']
    }),

  ]
}