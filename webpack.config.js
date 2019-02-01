;`use strict`

const path = require(`path`)
const webpack = require(`webpack`)
const WebpackPwaManifest = require('webpack-pwa-manifest')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const csswring = require('csswring')
const { InjectManifest } = require('workbox-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const bc = require(`./build-config`)

const client = {
  target: `web`,
  mode: bc.env,
  entry: {
    thailpha: `./js/application.js`,
  },
  output: {
    filename: `[name].[hash].js`,
    path: bc.buildPath,
    publicPath: `/`,
  },
  devtool: bc.isDev ? `source-map` : false,
  resolve: {
    alias: { '~': path.resolve(__dirname, `js`) },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, `js`)],
        use: {
          loader: `babel-loader`,
          options: { babelrc: true },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          bc.isDev ? `style-loader` : MiniCssExtractPlugin.loader,
          `css-loader`,
          {
            loader: `postcss-loader`,
            options: {
              ident: `postcss`,
              plugins: [autoprefixer({})].concat(
                bc.isDev ? [] : [csswring({ removeAllComments: true })]
              ),
            },
          },
          `sass-loader`,
        ],
      },
      // https://github.com/pugjs/pug-loader
      {
        test: /\.pug$/,
        use: [
          {
            loader: `pug-loader`,
            options: {
              self: true,
              pretty: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(bc.env),
      __IS_DEV__: JSON.stringify(bc.isDev),
      __APP_TITLE__: JSON.stringify(bc.APP_TITLE),
      __APP_DESC__: JSON.stringify(bc.APP_DESC),
      __APP_URL__: JSON.stringify(bc.APP_URL),
      __APP_VERSION__: JSON.stringify(bc.APP_VERSION),
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: bc.isDev ? `[name].css` : `[name].[hash].css`,
      chunkFilename: bc.isDev ? `[id].css` : `[id].[hash].css`,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `html/index.pug`),
      // custom variables
      // https://stackoverflow.com/a/41376115
      env: bc.env,
      isRelease: bc.isRelease,
      APP_TITLE: bc.APP_TITLE,
      // options: {
      //   minify: false,
      // },
    }),
    // PWA Manifest
    // https://www.npmjs.com/package/webpack-pwa-manifest
    new WebpackPwaManifest({
      // https://github.com/webpack/webpack/issues/237#issuecomment-342129128
      version: process.env.npm_package_version,
      name: bc.APP_TITLE,
      short_name: bc.APP_TITLE,
      background_color: `#fff`,
      theme_color: `black`,
      description: `Thai Alphabet`,
      lang: `en-US`,
      display: `standalone`,
      start_url: `${bc.BASE_URL}/index.html?utm_source=homescreen`,
      orientation: `any`,
      inject: true,
      ios: true,
      icons: [
        {
          src: bc.iconSource,
          // same sizes as nuxt-pwa
          sizes: [64, 120, 144, 152, 192, 384, 512],
          // destination: `img/icons`,
          ios: true,
        },
      ],
    }),
    // keep this in case we want to check a regular generated SW
    // new GenerateSW({
    //   swDest: `thailpha-sw.js`,
    //   include: [/\.html$/, /\.js$/, /\.css$/, /\.png$/, /\.svg$/, /\.json$/],
    //   cacheId: `thailpha-cache-v3`,
    //   navigateFallback: `${bc.BASE_URL}/index.html`,
    //   navigateFallbackWhitelist: [/\/(vowels|numbers|about|search|char\/)/],
    // }),
    // Workbox Service Worker
    // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#injectmanifest_plugin_1
    new InjectManifest({
      swSrc: path.resolve(__dirname, `js/service-worker-templates.js`),
      swDest: `thailpha-sw.js`,
      // importWorkboxFrom: `local`,
    }),
  ].concat(bc.isProd ? [new BundleAnalyzerPlugin()] : []),
  // https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: `thailpha-lib`,
          chunks: `all`,
        },
      },
    },
  },
}

module.exports = [client]
