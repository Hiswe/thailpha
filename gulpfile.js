'use strict'

const fs          = require( `fs` )
const args        = require( `yargs` ).argv
const del         = require( `del` )
const mergeStream = require( `merge-stream` )
const gulp        = require( `gulp` )
const $           = require( `gulp-load-plugins` )()
const run         = require( `run-sequence` )
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
const buildDir    = isDev ? '.tmp' : 'dist'

////////
// MISC
////////

const onError = err => {
  $.util.beep()
  if (err.annotated)      { $.util.log(err.annotated) }
  else if (err.message)   { $.util.log(err.message) }
  else                    { $.util.log(err) }
  return this.emit('end')
}

////////
// BUILD
////////

const mergeData = prefix => data => {
  const letters = Object.keys( data )
  const result  = letters.map( (name, index) => {
    const letter    = data[ name ]
    letter.id       = prefix + ( index + 1 )
    letter.isVowel  = /^v/.test( letter.id )
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

  const numbers = gulp.src('data/numbers/*.json')
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('dico-numbers.js', mergeData('n-')) )

  return mergeStream(cons, shortVowels, longVowels, numbers)
  .pipe( $.defineModule('commonjs') )
  .pipe( gulp.dest('js/models') )
}

////////
// JS
////////

const js = done => {
  bundler.run( (err, stat) => {
    if (err) return done( err )
    done()
  } )
}

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
  .pipe( $.purgeSourcemaps() )
  .pipe( $.if(isProd, cssProd()) )
  .pipe( gulp.dest(buildDir) )
  .pipe( reload({stream: true}) )
}

////////
// ASSETS
////////

const cleanIcon = require( `gulp-cheerio-clean-svg` )

//----- ICONS

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

//----- APP ICON

const touchIcon = () => {
  const basename    = 'touch-icon'
  const iconSource  = env === 'prod' ? 'data/ios.png' : 'data/ios-dev.png'
  return gulp
  .src( iconSource )
  .pipe( $.imageResize({width: 180, height: 180, upscale: true}) )
  .pipe( $.rename( path =>  path.basename = `${basename}-iphone-6-plus` ) )
  .pipe( gulp.dest(buildDir) )
  .pipe( $.imageResize({width: 152, height: 152, upscale: true}) )
  .pipe( $.rename( path =>  path.basename = `${basename}-ipad-retina` ) )
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

const assets = gulp.parallel(icons, touchIcon)

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
}

////////
// MISC
////////

const clean = () => del(['dist'])

const bump = () => {
  const type = args.major ? 'major' : args.minor ? 'minor' : 'patch'
  return gulp
  .src( './package*.json' )
  .pipe( $.bump({type}) )
  .pipe( gulp.dest('./') )
}

////////
// DEV
////////

const build = gulp.series(
  isDev ? data : gulp.parallel( clean, data ),
  gulp.parallel( assets, js, css, html )
)

const bs = () => {
  return browserSync.init({
    open: false,
    server: {
      baseDir:  `./${buildDir}`,
      index:    `index.html`,
    }
  })
}

let hash
const watch = () => {
  gulp.watch( `data/**/*.json`,  data )
  gulp.watch( `css/**/*.styl`,   css )
  gulp.watch( `html/*.jade`,     html )
  bundler.watch( {}, (err, stats) => {
    if (err) return onError( err )
    if (hash !== stats.hash) {
      hash = stats.hash
      reload()
    }
  })
}

const bsAndWatch = () => {
  bs()
  watch()
}

const dev = args.build === false ? bsAndWatch() :
  gulp.series( build, bsAndWatch )

gulp.task( `bump`,        bump )
gulp.task( `html`,        html )
gulp.task( `css`,         css )
gulp.task( `data`,        data )
gulp.task( `js`,          js )
gulp.task( `icons`,       icons )
gulp.task( `touch-icon`,  touchIcon )
gulp.task( `assets`,      assets )
gulp.task( `clean`,       clean )
gulp.task( `build`,       build )
gulp.task( `dev`,         dev )
gulp.task( `bsAndWatch`,         bsAndWatch )
