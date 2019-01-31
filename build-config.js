;`use strict`

const args = require(`yargs`).argv
const path = require(`path`)

const pkg = require(`./package.json`)

const isProd = args.compress === true
const isDev = !isProd
const env = isProd ? `production` : `development`
const isRelease = args.release === true
const buildDir = isRelease ? `dist` : `public`
const buildPath = path.resolve(__dirname, buildDir)
const releaseDest = `firebase`
const skipBuild = args.build === false
const skipBump = args.bump === false
const APP_TITLE = `Thailpha${isDev ? ' dev' : ''}`
const iconSource = `data/ios${isDev ? '-dev' : ''}.png`

module.exports = {
  isRelease,
  buildDir,
  buildPath,
  isProd,
  isDev,
  env,
  skipBuild,
  skipBump,
  appTitle: APP_TITLE,
  iconSource,
  releaseDest,
  APP_TITLE,
  APP_DESC: pkg.description,
  APP_URL: pkg.homepage,
  APP_VERSION: pkg.version,
}
