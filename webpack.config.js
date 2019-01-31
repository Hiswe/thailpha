;`use strict`

const path = require(`path`)
const webpack = require(`webpack`)
const WebpackPwaManifest = require('webpack-pwa-manifest')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const csswring = require('csswring')
const { GenerateSW } = require('workbox-webpack-plugin')

const bc = require(`./build-config`)

const client = {
  target: `web`,
  mode: bc.env,
  entry: {
    thailpha: `./js/index.jsx`,
  },
  output: {
    filename: `[name].[hash].js`,
    path: bc.buildPath,
    publicPath: `/`,
  },
  devtool: bc.isDev ? `source-map` : false,
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
      __BASE_URL__: JSON.stringify(bc.BASE_URL),
      __APP_TITLE__: JSON.stringify(bc.appTitle),
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
      isGhRelease: bc.isGhRelease,
      isFirebaseRelease: bc.isFirebaseRelease,
      appTitle: bc.appTitle,
      // options: {
      //   minify: false,
      // },
    }),
    // PWA Manifest
    // https://www.npmjs.com/package/webpack-pwa-manifest
    new WebpackPwaManifest({
      // https://github.com/webpack/webpack/issues/237#issuecomment-342129128
      version: process.env.npm_package_version,
      name: bc.appTitle,
      short_name: bc.appTitle,
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
    new GenerateSW({
      swDest: `thailpha-sw.js`,
      include: [/\.html$/, /\.js$/, /\.css$/, /\.png$/, /\.svg$/, /\.json$/],
      cacheId: `thailpha-cache-v3`,
      navigateFallback: `${bc.BASE_URL}/index.html`,
      navigateFallbackWhitelist: [/\/(vowels|numbers|about|search|char\/)/],
      // // need to return {{manifest: Array<ManifestEntry>, warnings: Array<String>|undefined}}
      // // https://github.com/GoogleChrome/workbox/issues/1341#issuecomment-370601915
      // manifestTransforms: [
      //   manifestEntries => ({
      //     manifest: manifestEntries.map(entry => {
      //       if (bc.BASE_URL) entry.url = `${bc.BASE_URL}/${entry.url}`
      //       return entry
      //     }),
      //   }),
      // ],
    }),
  ].concat(
    // need to be after WebpackPwaManifest to not be injected by iOS tags
    bc.isGhRelease
      ? [
          new HtmlWebpackPlugin({
            filename: `404.html`,
            inject: false,
            template: path.resolve(__dirname, `html/404.pug`),
          }),
        ]
      : []
  ),
  // https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // chunks: `initial`,
          // test: path.resolve(__dirname, `node_modules`),
          test: /[\\/]node_modules[\\/]/,
          name: `thailpha-lib`,
          chunks: `all`,
          // enforce: true,
        },
      },
    },
  },
}

module.exports = [client]
