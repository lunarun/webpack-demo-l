#### 全局变量引入-引入第三方模块方式：比如jquery: $
1. expose-loader 暴露到全局
2. webpack.ProvidePlugin 自动加载模块， 不必到处import 或 require
3. externals: 外部扩展 比如:从 CDN 引入 jQuery，或者在组件中 import $ from 'jquery'， 不想打包jquery到bundle包体中时，配置如下 （包括query打包和去除jquery打包 包体相差310k左右）
```
module.exports = {
  //...
  externals: {
    jquery: 'jQuery'
  }
};
```
// 如果在引入cdn的情况下仍有import包体，不想引入的情况下，搭配external不打包进入包体
// import jQuery from 'jquery'; 
console.log(jQuery) // 全局$定义在external里
****
#### webpack打包图片
1. 在js中创建图片来引入  
2. 在css中引入 background(url)  
3. img标签: html-withimg-loader (打包后会有空格错误)； html-loader（打包后错误）待解决  
【备注】file-loader 与 url-loader两个同时搭配时会生成两个图片文件，导致图片显示不出，目前处理方式是选择url-loader。 待解决  
****
#### 打包文件分类
输出的路径可以自定义
例如：'css/[name].css' 打包会自动生成css文件夹
new MiniCssExtractPlugin({
  filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css', // ’css/‘可以自定义路径
  chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css',
}),
1. url-loader: outputPath: 'img/', // 图片自动归类到生成的img文件夹下
2. url-loader: publicPath: 'test/' // 可以实现对图片单独加上路径前缀 实现外部加载
【注】如果想对全局的cdn文件进行路径配置：output: publicPath: '/test/', // 用于按需加载或加载外部资源（cdn）时设置路径前缀，会自动加到图片或文件的前面 -> /test/img/9cb3a1b4ab2d541a71094a42542ebd04.jpg
****
#### 多页面应用打包
如果配置创建了多个单独的 "chunk"（例如，使用多个入口起点或使用像 CommonsChunkPlugin 这样的插件），则应该使用占位符(substitutions)来确保每个文件具有唯一的名称。
例如：
```
{
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: 'js/[name].[chunkhash:8].js', // 'js/'会自动打包生成js文件夹(打包文件分类)
    path: __dirname + '/dist'
  }
}
```
1. 打包后的输出模版html也需要是多页面的（index.html, search.html）需要用到**HtmlWebpackPlugin**插件
2. 配置N个html-webpack-plugin可以生成多个页面入口
3. 添加chunks属性：当多个入口文件，需要编译后生成多个打包文件，那么chunks就能帮助选择要使用的js文件打包到对应的文件里
[HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin#configuration) github上有更详细的介绍
例如
```
plugins: [
  new HtmlWebpackPlugin({
    title: 'search',
    template: './src/index.html',
    filename: 'src/search.html',
    chunks: ['search']
  })
]
```
打包后，serach.html文件里只引入search.js文件。