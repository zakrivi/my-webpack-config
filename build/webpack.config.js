const Path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将css样式全部合并到一个单独css文件
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const devMode = process.argv.indexOf('--mode=production') === -1 //webpack的mode和process的mode没有任何联系
const Happypack = require('happypack')
const os = require('os')
const HappyThreadPool = Happypack.ThreadPool({
  size: os.cpus().length
})
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Webpack = require('webpack')

module.exports = {
  entry: {
    main: Path.resolve(__dirname, '../src/main.js'), //入口文件
    header: Path.resolve(__dirname, '../src/header.js'), //入口文件
  },
  output: {
    filename: '[name].[hash:8].js', // 打包后的文件名称
    path: Path.resolve(__dirname, '../dist') //打包后的目录
  },

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@': Path.resolve(__dirname, '../src')
    },
    extensions: ['*', '.js', '.json', '.vue']
  },
  module: {
    rules: [{
        test: /\.css$/,
        // use: ['style-loader', 'css-loader'] //从右向左解析原则
        // use: [MiniCssExtractPlugin.loader, 'css-loader'] //从右向左解析原则
        use: [{
            loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../dist/css/',
              hmr: devMode
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          },
        ],

      },
      {
        test: /\.less$/,
        use: [{
            loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../dist/css/',
              hmr: devMode
            }
          },
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          },
        ] // 从右向左解析原则
      },
      {
        test: /\.(jpe?g|png|gif)$/i, //图片文件
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'img/[name].[hash:8].[ext]'
              }
            }
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'media/[name].[hash:8].[ext]'
              }
            }
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, //字体
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[hash:8].[ext]'
              }
            }
          }
        }]
      },
      {
        test: /\.js$/,
        // 把js文件处理交给id为happBabel的happyPack的实例执行
        use: [{
          loader: 'happypack/loader?id=happBabel'
        }],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: ['cache-loader', 'vue-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), //打包前清空dist
    // 多页面
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      chunks: ['main'] // 与入口文件对应的模块名
    }),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../public/header.html'),
      filename: 'header.html',
      chunks: ['header'] // 与入口文件对应的模块名
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash]css'
    }),
    new vueLoaderPlugin(),
    new Happypack({
      id: 'happBabel', // loader对应的id标识
      // 用户和loader的配置一样，注意这里是loaders
      loaders: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          cacheDirectory: true
        }
      }],
      threadPool: HappyThreadPool
    }),
    new CopyWebpackPlugin([{ //复制静态文件
        from: Path.resolve(__dirname, '../public'),
        to: Path.resolve(__dirname, '../dist')
      },
      {
        from: Path.resolve(__dirname, '../static'),
        to: Path.resolve(__dirname, '../dist/static')
      }
    ]),
    //  bundles拆分多少个，就写多少个对应bundles
    // html文件手动引用xxx.dll.js
    new Webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(Path.join(__dirname, '../static/dll/vue-manifest.json'))
    }),
  ]
}
