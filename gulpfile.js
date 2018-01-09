'use strict'

const fs          = require( `fs` )
const args        = require( `yargs` ).argv
const del         = require( `del` )
const mergeStream = require( `merge-stream` )
const gulp        = require( `gulp` )
const $           = require( `gulp-load-plugins` )()
const lazypipe    = require( `lazypipe` )
const browserSync = require( `browser-sync` ).create()
const webpack     = require( `webpack` )
const { reload }  = browserSync

const env         = args.prod ? `production` : `development`
const isDev       = env === `development`
const isProd      = !isDev
const bundler     = webpack( require(`./webpack.config.js`) )
const dest        = {
  prod: 'dist',
  dev:  '.tmp',
};
const buildDir    = isDev ? '.tmp' : 'public'

$.util.log( 'environment is', $.util.colors.magenta(env) )

////////
// MISC
////////

// no arrow function: we're using `this`
function onError(err) {
  $.util.beep()
  if (err.annotated)      { $.util.log(err.annotated) }
  else if (err.message)   { $.util.log(err.message) }
  else                    { $.util.log(err) }
  return this.emit( 'end' )
}

////////
// JS
////////

//----- APPLICATION

const jsApp = done => {
  bundler.run( (err, stats) => {
    // https://webpack.js.org/api/node/#error-handling
    if (err) return done( err )
    const info = stats.toJson()
    if ( stats.hasErrors() ) return done( info.errors )
    done()
  } )
}
jsApp.description = `bundle the JS front application`

//----- SERVICE WORKER

const serviceWorker = () => {
  return gulp
  .src( './js/service-worker.js' )
  .pipe( $.if(isProd, $.stripDebug()) )
  .pipe( $.if(isProd, $.uglifyEs.default()) )
  .pipe( gulp.dest( buildDir ) )
}
jsApp.description = `bundle service-worker script`

//----- DATA DICTIONNARY

const mergeData = prefix => data => {
  const letters = Object.keys( data )
  const result  = letters.map( (name, index) => {
    const letter    = data[ name ]
    letter.id       = prefix + ( index + 1 )
    ; /^c/.test( letter.id ) ? letter.isConsonant = true
    : /^n/.test( letter.id ) ? letter.isNumber = true
    : letter.isVowel = true
    if ( letter.isVowel ) {
      ; /^vs/.test( letter.id ) ? letter.isShort = true
      : /^vl/.test( letter.id ) ? letter.isLong = true
      : letter.isDiphtongOrMisc = true
    }
    letter.longId   = prefix + letter.rtgs.replace( ' ', '-' )
    return letter
  })
  return new Buffer( JSON.stringify(result, null, 2) )
}

const data = () => {
  const cons = gulp
  .src( 'data/consonants/*.json' )
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('dico-consonants.js', mergeData('c-')) )

  const shortVowels = gulp
  .src('data/vowels/short/*.json')
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('dico-short-vowels.js', mergeData('vs-')) )

  const longVowels = gulp.src('data/vowels/long/*.json')
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('dico-long-vowels.js', mergeData('vl-')) )

  const diphtongsMisc = gulp.src('data/vowels/diphthongs-and-misc/*.json')
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('dico-diphtongs-misc.js', mergeData('dm-')) )

  const numbers = gulp.src('data/numbers/*.json')
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('dico-numbers.js', mergeData('n-')) )

  return mergeStream(cons, shortVowels, longVowels, numbers, diphtongsMisc)
  .pipe( $.defineModule('es6') )
  .pipe( gulp.dest('js/models') )
}
data.description = `update Thai dictionary to be consummable by the JS front application`

//----- ALL JS

const js = gulp.series(
  data,
  gulp.parallel( jsApp, serviceWorker )
)
js.description = `build every JS files`

////////
// CSS
////////

const autoprefixer  = require( 'autoprefixer' )
const csswring      = require( 'csswring' )

const cssProd       = lazypipe()
  .pipe( $.purgeSourcemaps )
  .pipe( $.postcss, [
    csswring({ removeAllComments: true })
  ] )

const css = () => {
  return gulp
  .src( `css/index.styl` )
  .pipe( $.plumber(onError) )
  .pipe( $.sourcemaps.init() )
  .pipe( $.stylus({
    'include css': true,
    define: {
      isProd: isProd,
    }
  }) )
  .pipe( $.postcss([
    autoprefixer(),
  ]) )
  .pipe( $.sourcemaps.write() )
  .pipe( $.if(isProd, cssProd()) )
  .pipe( $.rename( 'thailpha.css' ) )
  .pipe( gulp.dest(buildDir) )
  .pipe( reload({stream: true}) )
}
css.description = `build css files (from stylus)`

////////
// ASSETS
////////

const cleanIcon = require( `gulp-cheerio-clean-svg` )

//----- ICONS (not used for now)

const icons = () => {
  return gulp
  .src( `icons/*.svg` )
  .pipe( $.cheerio(cleanIcon()) )
  .pipe( $.svgSymbols({
    id:         `icon-%f`,
    className:  `.icon-%f`,
  }) )
  .pipe( $.if( /[.]svg$/, gulp.dest('html')) )
  .pipe( $.if( /[.]css$/, gulp.dest('css')) )
}
icons.description = `bundle SVG files`

//----- APP ICON

const touchIcon = () => {
  const basename    = 'touch-icon'
  const iconSource  = isProd ? 'data/ios.png' : 'data/ios-dev.png'
  return gulp
  .src( iconSource )
  .pipe( $.imageResize({width: 180, height: 180, upscale: true}) )
  .pipe( $.rename( path =>  path.basename = `${basename}-iphone-6-plus` ) )
  .pipe( gulp.dest(buildDir) )
  .pipe( $.imageResize({width: 152, height: 152, upscale: true}) )
  .pipe( $.rename( path =>  path.basename = `${basename}-ipad-retina` ) )
  .pipe( gulp.dest(buildDir) )
  .pipe( $.imageResize({width: 144, height: 144, upscale: true}) )
  .pipe( $.rename( path =>  path.basename = `${basename}-web-app` ) )
  .pipe( gulp.dest(buildDir) )
  .pipe( $.imageResize({width: 120, height: 120, upscale: true}) )
  .pipe( $.rename( path =>  path.basename = `${basename}-iphone-retina` ) )
  .pipe( gulp.dest(buildDir) )
  .pipe( $.imageResize({width: 76, height: 76, upscale: true}) )
  .pipe( $.rename( path =>  path.basename = `${basename}-icon-ipad` ) )
  .pipe( gulp.dest(buildDir) )
  .pipe( $.imageResize({width: 57, height: 57, upscale: true}) )
  .pipe( $.rename( path =>  path.basename = `${basename}-icon-iphone` ) )
  .pipe( gulp.dest(buildDir) )
}
touchIcon.description = `resize favicon for different devices`

//----- WEB MANIFEST

const webManifest = () => {
  return gulp
  .src( 'manifest.json' )
  .pipe( gulp.dest(buildDir) )
}
webManifest.description = `copy the web manifest to the right place`

// const assets = gulp.parallel(icons, touchIcon)
const assets = gulp.parallel( webManifest, touchIcon )
assets.description = `build every assets`

////////
// HTML
////////

const html = () => {
  return gulp
  .src( 'html/index.pug' )
  .pipe( $.pug({
    pretty: isDev,
    locals: { env }
  }) )
  .pipe( gulp.dest(buildDir) )
  .pipe( $.rename('200.html') )
  .pipe( gulp.dest(buildDir) )
}
html.description = `build index.html`

////////
// MISC
////////

const clean = () => del(['public/*'])
clean.description = `clean everything in the production (public) folder`

const bump = () => {
  const type = args.major ? 'major' : args.minor ? 'minor' : 'patch'
  return gulp
  .src( './package*.json' )
  .pipe( $.bump({type}) )
  .pipe( gulp.dest('./') )
}
bump.description = `bump versions in *.json files`

////////
// DEV
////////

const showBundleSize = () => {
  return gulp
  .src( [`${buildDir}/*.js`, `${buildDir}/*.css`] )
  .pipe( $.size({gzip: true, showFiles: true}) )
}

const buildDev  = gulp.parallel( assets, js, css, html )
buildDev.description = `build everything (dev)`
const buildProd = gulp.series( clean, buildDev, showBundleSize)
buildProd.description = `build everything (prod)`

const historyFallback = require( 'connect-history-api-fallback' )
const bs = () => {
  return browserSync.init({
    open: false,
    server: {
      baseDir:  `./${buildDir}`,
      index:    `index.html`,
      middleware: [
        historyFallback(),
      ],
    }
  })
}

let hash
const watch = () => {
  gulp.watch( `manifest.json`,                  webManifest )
  gulp.watch( `data/**/*.json`,                 data )
  gulp.watch( `css/**/*.styl`,                  css )
  gulp.watch( `html/*`,                         html )
  gulp.watch( `js/service-worker.js`,           serviceWorker )
  gulp.watch( `.tmp/service-worker.js`,         reload )
  bundler.watch( {}, (err, stats) => {
    if (err) return onError( err )
    const info = stats.toJson()
    if ( stats.hasErrors() ) return info.errors.forEach( error => console.error(error) )
    if (hash !== stats.hash) {
      hash = stats.hash
      reload()
    }
  })
}
watch.description = `watch & rebuild on change`

const bsAndWatch = () => {
  bs()
  watch()
}

const dev = args.build === false ? bsAndWatch() :
  gulp.series( buildDev, bsAndWatch )
dev.description = `build, watch & launch a dev server`

gulp.task( `bump`,        bump )
gulp.task( `html`,        html )
gulp.task( `css`,         css )
gulp.task( `data`,        data )
gulp.task( `js`,          js )
gulp.task( `js:app`,      jsApp )
// gulp.task( `icons`,       icons )
gulp.task( `touch-icon`,  touchIcon )
gulp.task( `assets`,      assets )
gulp.task( `clean`,       clean )
gulp.task( `buildDev`,    buildDev )
gulp.task( `buildProd`,   buildProd )
gulp.task( `dev`,         dev )
gulp.task( `watch`,       watch )
