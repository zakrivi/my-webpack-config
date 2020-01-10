const Path = require('path')
const Webpack = require('webpack')
const srcPath = Path.join(__dirname, '../static/dll/');

module.exports = {
  // 你想要打包的模块的数组
  entry: {
    // vendor: ['vue', 'element-ui']
    vue: ['vue']
  },
  output: {
    path: srcPath, //打包后文件输出的位置
    filename: '[name].dll.js',
    library: '[name]_library'
    //这里需要和webpack.DLLPlugin中的`name: [name]_library` 保持一致
  },
  plugins: [
    new Webpack.DllPlugin({
      path: Path.join(srcPath, '[name]-manifest.json'),
      name: '[name]_library',
      context: __dirname
    })
  ]
}
