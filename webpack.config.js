let path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 抽离index.html里的style到main.css 不包括index.html里内置style
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
// 优化css - production环境
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// webpack默认压缩js的plugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const devMode = process.env.NODE_ENV !== 'production'; // 此时process.env.NODE_ENV undefined

module.exports = {
  devServer: { // 开发服务器配置 - 不会build文件
    contentBase: path.join(__dirname, "dist"),
    port: 3001,
    progress: true,
  },
  devtool: 'eval-source-map',
  entry: {
    main: './src/index.js' // 单入口 默认main
    // search: './src/search.js', // 多入口，自定义名称
  },
  output: {
    // filename: 'bundle.js',
    filename: '[name].[chunkhash:8].js', // 缓存 - 确保浏览器获取到修改后的文件；构建后的入口chunk; 可以自定义位数
    path: path.resolve(__dirname, 'dist'),
    // libraryTarget: 'umd',
    // publicPath: '/',
  },
  watch: true, // 执行webpack后可实时打包文件
  watchOptions: {
    aggregateTimeout: 300, // 防抖时间
    poll: 1000, // 每秒问我1000次
    ignored: /node_modules/
  },  
  mode: 'development', // production
  optimization: { // 优化项 - 生产环境
    minimizer: [new UglifyJsPlugin({ // 压缩js - 生产环境
      sourceMap: true,
    }), new OptimizeCSSAssetsPlugin({})], // webpack默认是用uglifyjs-webpack-plugin压缩js,用了这个插件之后css会压缩，但是会影响到js压缩，需要手动配置glifyjs-webpack-plugin
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 打包后的模版html
    new HtmlWebpackPlugin({
      title: 'index',
      template: './src/index.html',
      filename: 'index.html', // 默认的是index.html
      minify: { // 模版压缩 - production
        collapseWhitespace: true,
        removeComments: true,
      },
      hash: true,
      // chunks: ['index'],
    }),
    // new HtmlWebpackPlugin({
    //   title: 'search',
    //   template: './src/index.html',
    //   filename: 'src/search.html',
    //   chunks: ['search']
    // }),
    new MiniCssExtractPlugin({
      filename: devMode ? 'style/[name].css' : 'style/[name].[hash].css', // ’css/‘可以自定义路径
      chunkFilename: devMode ? 'style/[id].css' : 'style/[id].[hash].css',
    }),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    // }),
  ],
  externals: {
    jquery: '$'
  },
  module: { // 模块
    rules: [ // 规则 
      /*css-loader 支持@import 'index.css'这种语法的
      * style-loader 是把css 插入到head 的标签中
      * loader特点：希望单一，只处理一个功能
      * 多个loader：[], 顺序默认是从右到左 从下到上执行
      * loader还可以写成对象方式-方便配置其他参数
      */
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,  // 'style-loader', // 插到link里面
            options: {
              // insertAt: 'top'
              publicPath: './',
            },
          },
          'css-loader', // @import, 解析路径
          'postcss-loader', // 放在css-loader之后，其他loader之前； 需要配置postcss.config.js文件
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
          'less-loader',
        ]
      },
      // {
      //   test: /\.(js|jsx)$/,
      //   use: {
      //     loader: 'eslint-loader', // 校验js规则 - eslint - 需要配置.eslintrc.js
      //     options: {
      //       enforce: 'pre',
      //     }
      //   },
      //   include: [path.resolve(__dirname, 'src')], // 指定检查的目录
      //   exclude: /node_modules/,
      // },
      {
        test: /\.(js|jsx)$/, // 普通loader
        use: {
          loader: 'babel-loader', // 用babel-loader将es6 -> es5
          options: { 
            presets: [ // 大插件的集合
              '@babel/preset-env',
            ],
            plugins: [ // 小插件
              ["@babel/plugin-proposal-decorators", { "legacy": true }], // @log
              ["@babel/plugin-proposal-class-properties", { "loose" : true }], // class A{}
              ["@babel/plugin-transform-runtime"],
            ]
          }
        },
        exclude: /node_modules/
      },
      // {
      //   test: /\.(png|svg|jpg|gif)$/,
      //   use: [
      //     'file-loader'
      //   ]
      // },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 如果图片小于8192字节 就转为base64
              outputPath: 'assets/', // 图片自动归类到生成的img文件夹下 自定义输出目录
              publicPath: '/dist/assets/' // 自定义发布目录，生成的页面中对图片路径的引用路径配置
            }
          }
        ]
      },
    ]
  }
}