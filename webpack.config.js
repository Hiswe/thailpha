`use strict`

const path    = require( `path` )
const webpack = require( `webpack` )
const args    = require( `yargs` ).argv

const env       = args.prod ? `production` : `development`
const isDev     = env === `development`
const isProd    = !isDev
const destPath  = path.resolve( __dirname, isDev ? `.tmp` : `public` )

const entry   = {
  thailpha: `./js/index.jsx`,
}
const output  = {
  filename: `[name].js`,
  path:     destPath,
}
const plugins = [
  // https://webpack.js.org/plugins/commons-chunk-plugin/#passing-the-minchunks-property-a-function
  new webpack.optimize.CommonsChunkPlugin({
    name:     `vendor`,
    filename: `thailpha-lib.js`,
    minChunks: m => m.context && m.context.indexOf( `node_modules` ) !== -1
  }),
]

const rules = [
  {
    test:     /\.jsx?$/,
    include: [
      path.resolve( __dirname, 'js' ),
    ],
    use: {
      loader: 'babel-loader',
      options: {
        presets: [ 'es2015' ],
        plugins: [
          'transform-object-rest-spread',
          [ 'transform-react-jsx', { pragma: 'h' } ]
        ],
      },
    },
  },
]

const resolve = {
  alias: {
    'react': 'preact-compat',
    'react-dom': 'preact-compat',
  },
}

module.exports = {
  entry,
  output,
  watch:    true,
  devtool:  'inline-source-map',
  plugins,
  resolve,
  module: {
    rules,
  },
}
