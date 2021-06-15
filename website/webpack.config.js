/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProd = process.env.NODE_ENV === 'production'
const isPlay = !!process.env.PLAY_ENV

const config = {
  mode: isProd ? 'production' : 'development',
  devtool: !isProd && 'cheap-module-eval-source-map',
  entry: isPlay ?
    path.resolve(__dirname, './play.js') : path.resolve(__dirname, './entry.js'),
  output: {
    path: path.resolve(__dirname, '../website-dist'),
    publicPath: '/',
    filename: isProd ? '[name].[hash].js' : '[name].js',
  },
  stats: 'verbose',
  module: {
    rules: [{
      test: /\.vue$/,
      use: 'vue-loader',
    },
    {
      test: /\.(ts|js)x?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    },
    {
      test: /\.md$/,
      use: [{
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false,
          },
        },
      },
      {
        loader: path.resolve(__dirname, './md-loader/index.js'),
      },
      ],
    },
    {
      test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
      loader: 'url-loader',
      // todo: 这种写法有待调整
      query: {
        limit: 10000,
        name: path.posix.join('static', '[name].[hash:7].[ext]'),
      },
    },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
    alias: {
      vue: 'vue/dist/vue.esm-browser.js',
      examples: path.resolve(__dirname),
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './website/index.tpl',
      filename: './index.html',
      favicon: './website/favicon.ico',
    }),
    // new BundleAnalyzerPlugin(),
  ],
  devServer: {
    inline: true,
    hot: true,
    stats: 'minimal',
    publicPath: '/',
    contentBase: __dirname,
    overlay: true,
    proxy: {
      '/api': {
        target: 'http://172.19.201.201:9203',
        pathRewrite: { '^/api': '/index.html' },
        changeOrigin: true, // target是域名的话，需要这个参数，
        secure: false, // 设置支持https协议的代理
        bypass: function(req, res, proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.')
            return '/index.html'
          }
        },
      },
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
}

const cssRule = {
  test: /\.(sass|scss|css)$/,
  use: [
    'css-loader',
    {
      loader: 'sass-loader',
      options: {
        implementation: require('sass'),
      },
    },
  ],
}

// if (isProd) {
config.plugins.push(
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
    chunkFilename: '[id].[contenthash].css',
  }),
)
cssRule.use.unshift(MiniCssExtractPlugin.loader)
// } else {
cssRule.use.unshift('style-loader')
// }
config.module.rules.push(cssRule)
module.exports = config
