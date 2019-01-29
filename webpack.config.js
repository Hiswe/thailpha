;`use strict`

const path = require(`path`)
const webpack = require(`webpack`)
const WebpackPwaManifest = require('webpack-pwa-manifest')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const csswring = require('csswring')

const bc = require(`./build-config`)

const client = {
  target: `web`,
  mode: bc.env,
  entry: {
    thailpha: `./js/index.jsx`,
  },
  output: {
    filename: `[name].js`,
    path: bc.buildPath,
  },
  devtool: bc.isDev ? `source-map` : false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(bc.env),
      IS_DEV: JSON.stringify(bc.isDev),
      BASE_URL: JSON.stringify(bc.BASE_URL),
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
      // ios: true,
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
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: bc.isDev ? `[name].css` : `[name].[hash].css`,
      chunkFilename: bc.isDev ? `[id].css` : `[id].[hash].css`,
    }),
  ],
  // https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: `initial`,
          test: path.resolve(__dirname, `node_modules`),
          name: `thailpha-lib`,
          enforce: true,
        },
      },
    },
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
    ],
  },
}

module.exports = [client]
