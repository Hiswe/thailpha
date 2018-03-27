`use strict`

const path            = require( `path` )
const webpack         = require( `webpack` )

const bc            = require( `./build-config` )

const client = {
  target: `web`,
  mode:   bc.env,
  entry:  {
    thailpha: `./js/index.jsx`,
  },
  output: {
    filename: `[name].js`,
    path:     bc.buildPath,
  },
  devtool: bc.isDev ? `source-map` : false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify( bc.env ),
      'IS_DEV':               JSON.stringify( bc.isDev ),
      'BASE_URL':             JSON.stringify( bc.BASE_URL ),
    })
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
        }
      }
    }
  },
  module: {
    rules: [{
      test:     /\.jsx?$/,
      include: [ path.resolve( __dirname, `js` ) ],
      use: {
        loader: `babel-loader`,
        options: { babelrc: true },
      },
    },
  ]},
}

module.exports = [ client ]
