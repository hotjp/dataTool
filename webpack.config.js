const resolve = require('path').resolve;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const url = require('url');
const publicPath = '';

module.exports = (options = {}) => ({
  entry: {
    vue: ['vue', 'vue-router','element-ui'],
    lib: ['jquery'],
    echart: ['echarts','echarts-gl','echarts-wordcloud'],
    index: './src/main.js'
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[name].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
  },
  module: {
    rules: [{
      test: /\.vue$/,
      use: ['vue-loader']
    },
    {
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: [resolve(__dirname, 'src/vendor')],
      include:[resolve('src'),resolve('node_modules/vue-echarts-v3/src')]
    },
    {
      test: /\.less$/,
      use: [ 'style-loader', 'css-loader', 'less-loader']
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader']  
    },
    {
      test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }]
    },
    {
      test: /\.html$/,
      use: ['html-loader'],
      exclude: [resolve(__dirname, 'src/index.html')]    
    }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['lib','vue','echart','manifest']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name:'vendor',
      minChunks: ({ resource }) => (
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/)
      )
    }),
    // new ExtractTextPlugin('styles.css'),
    // new PreloadWebpackPlugin({
    //   rel: 'preload',
    //   include: 'allChunks'
    // }),
    new CopyWebpackPlugin([{
      from: 'src/assets',
      to:'assets'
    },
    {
      from: 'src/viewer',
      to:'viewer'
    },{
      from: 'src/data_editor',
      to:'data_editor'
    },{
      from: 'src/vendor',
      to:'vendor'
    }])
    // new BundleAnalyzerPlugin()
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    }
  },
  devServer: {
    host: '127.0.0.1',
    port: 8010,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  // devtool: options.dev ? '#source-map' : ''
  devtool: '#source-map'
});