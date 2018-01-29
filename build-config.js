`use strict`

const args = require( `yargs` ).argv
const path = require( `path` )

const isRelease   = args.release === true
const buildDir    = isRelease ? `dist` : `public`
const buildPath   = path.resolve( __dirname, buildDir )
const isGhRelease = args.dest === `github`
const BASE_URL    = isGhRelease ? `/thailpha` : ``
const isProd      = args.compress === true
const isDev       = !isProd
const env         = isProd ? `production` : `development`
const skipBuild   = args.build === false
const skipBump    = args.bump === false
const appTitle    = `Thailpha${ isDev ? ' dev' : '' }`
const iconSource  = `data/ios${ isDev ? '-dev' : '' }.png`

module.exports = {
  isRelease,
  buildDir,
  buildPath,
  BASE_URL,
  isProd,
  isDev,
  env,
  skipBuild,
  skipBump,
  appTitle,
  iconSource,
  isGhRelease,
}

