`use strict`

const path                      = require( `path` )
const webpack                   = require( `webpack` )
const args                      = require( `yargs` ).argv
const UglifyJSPlugin            = require( `uglifyjs-webpack-plugin` )

const env       = args.prod ? `production` : `development`
const isDev     = env === `development`
const isProd    = !isDev
const destPath  = path.resolve( __dirname, isDev ? `.tmp` : `dist` )

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

if ( isProd ) {
  plugins.push( new UglifyJSPlugin() )
  plugins.push( new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }) )
}

const rules = [
  {
    test:     /\.jsx?$/,
    include: [
      path.resolve( __dirname, 'js' ),
    ],
    use: {
      loader: 'babel-loader',
      options: {
        presets: [ 'env' ],
        plugins: [
          'transform-object-rest-spread',
          'transform-react-jsx',
          // // change React.createElement to `h`
          // [ 'transform-react-jsx', { pragma: 'h' } ]
        ],
      },
    },
  },
]

const resolve = {
  // alias: {
  //   'react':     'preact-compat',
  //   'react-dom': 'preact-compat',
  // },
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
