let path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    // filename: 'bundle.js',
    filename: '[name].[chunkhash:8].js', // 缓存 - 确保浏览器获取到修改后的文件；构建后的入口chunk; 可以自定义位数
    path: path.resolve(__dirname, 'dist') // 必须是绝对路径 
  },
  devServer: { // 开发服务器配置 - 不会build生成文件
    contentBase: path.join(__dirname, "dist"),
    port: 3001,
    progress: true,
  },
  mode: 'production',
  plugins: [
    // 构建前清理dist文件夹
    new CleanWebpackPlugin(),
    // 打包后的模版html
    new HtmlWebpackPlugin({
      title: 'output management',
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        // removeAttributeQuotes: true, // 去掉双引号
      },
      'meta': { // inject meta tags in index.html
        'theme-color': '#4285f4'
      },
      hash: true, // hash to all included scripts and css files, useful for cache.
    })
  ]
}