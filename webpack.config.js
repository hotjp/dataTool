const resolve = require('path').resolve;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const url = require('url');
const publicPath = '';

module.exports = (options = {}) => ({
  entry: {
    vendor: ['vue', 'vue-router','element-ui','animate.css','stats.js','moment'],
    lib: ['jquery','lodash'],
    echarts: ['echarts','vue-echarts-v3','echarts-gl','echarts-wordcloud'],
    index: './src/main.js'
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
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
      use: ['html-loader']
    }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
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
  devtool: options.dev ? '#eval-source-map' : '#source-map'
});