// 生产环境主要实现的是压缩代码、提取css文件、合理的sourceMap、分割代码
const path = require('path')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

const config = WebpackMerge(webpackConfig, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  optimization: {
    minimizer: [
      // new UglifyJsPlugin({//压缩js
      //     cache: true,
      //     parallel: true,
      //     sourceMap: true
      // }),
      new WebpackParallelUglifyPlugin({
        cacheDir: '.cache/',
        uglifyJs: {
          output: {
            comments: false,
            beatify: false
          },
          compress: {
            drop_console: true,
            collapse_Vars: true,
            reduce_vars: true
          }
        }
      }),
      new OptimizeCssAssetsPlugin({})
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial" // 只打包初始时依赖的第三方
        }
      }
    }
  },

})

if (process.env.npm_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  config.plugins.push(new BundleAnalyzerPlugin({
    openAnalyzer: true,
    analyzerMode: 'static',
    generateStatsFile: true
  }))
}

module.exports = config
