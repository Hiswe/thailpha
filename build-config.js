`use strict`

const args = require( `yargs` ).argv
const path = require( `path` )

const isProd      = args.compress === true
const isDev       = !isProd
const env         = isProd ? `production` : `development`
const isRelease   = args.release === true
const buildDir    = isRelease ? `dist` : `public`
const buildPath   = path.resolve( __dirname, buildDir )
const isGhRelease = args.dest === `gh`
const isFirebaseRelease = !isGhRelease
const releaseDest = isGhRelease ? `github`
  : isFirebaseRelease ? `firebase`
  : `UNKNOWN`
const BASE_URL    = isProd && isGhRelease ? `/thailpha` : ``
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
  isFirebaseRelease,
  releaseDest,
}
