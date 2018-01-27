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
const magenta     = require( `ansi-magenta` )
const log         = require( `fancy-log` )
const beeper      = require( `beeper` )
const workbox     = require( `workbox-build` )
const inquirer    = require( `inquirer` )

const { version } = require( `./package.json` )
let newVersion    = false
const { reload }  = browserSync
const env         = args.prod ? `production` : `development`
const isDev       = env === `development`
const isProd      = !isDev
const appTitle    = isDev ? `Thailpha dev` : `Thailpha`
const bundler     = webpack( require(`./webpack.config.js`) )
const buildDir    = isDev ? '.tmp' : 'dist'

log( 'environment is', magenta(env) )

////////
// MISC
////////

// no arrow function: we're using `this`
function onError(err) {
  beeper()
  if (err.annotated)      { log(err.annotated) }
  else if (err.message)   { log(err.message) }
  else                    { log(err) }
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

//----- WORKBOX

// all options are listed here
// https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.Configuration
function workboxSW() {
  return workbox.generateSW({
    globDirectory:    buildDir,
    globPatterns:     ['**\/*.{html,js,css,png,svg,json}'],
    swDest:           `${buildDir}/thailpha-sw.js`,
    cacheId:          `thailpha-cache-v3`,
    navigateFallback: `/index.html`,
    navigateFallbackWhitelist: [
      /\/(vowels|numbers|about|search|char\/)/,
    ],
    // this is for allowing thailpha-lib.js in dev
    maximumFileSizeToCacheInBytes: isDev ? 5000000 : 2097152,
  }).catch( error  => console.warn('Service worker generation failed: ' + error) )

}
workboxSW.description = `generate the service worker using workbox`

//----- DATA DICTIONNARY

const charType = {
  c:  `isConsonant`,
  tm: `isToneMark`,
  vs: `isVowel`,
  vl: `isVowel`,
  ds: `isDiphtong`,
  dl: `isDiphtong`,
  gs: `isGlide`,
  gl: `isGlide`,
  m:  `isMiscellanous`,
  n:  `isNumber`,
}

const mergeData = prefix => data => {
  const letters = Object.keys( data )
  const result  = letters.map( (name, index) => {
    const letter    = data[ name ]
    letter.id       = `${ prefix }-${ index + 1 }`
    letter[ charType[prefix] ] = true
    // normalize arrays
    ;[`similar`, `variant`].forEach( key => {
      const hasKey      = Array.isArray(letter[key]) && letter[key].length
      const booleanKey      = `has${ key.charAt(0).toUpperCase() + key.substr(1) }`
      letter[ booleanKey ]  = hasKey > 0
      letter[ key ]         = letter[ booleanKey ] ? letter[ key ] : []
    })
    if ( /^[vdg]l$/.test(prefix) ) letter.isLong = true
    if ( /^[vdg]s$/.test(prefix) ) letter.isShort = true
    if ( letter.meaning ) {
      letter.longMeaning = `${letter.rtgs.split(' ')[1]}: ${letter.meaning}`
    }
    letter.longId   = `${ prefix }-${ letter.rtgs.replace( ' ', '-' ).toLowerCase() }`
    return letter
  })
  return new Buffer( JSON.stringify(result, null, 2) )
}

const data = () => {
  const cons = gulp
  .src( 'data/consonants/*.json' )
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('01-dico-consonants.json', mergeData('c')) )

  const toneMarks = gulp
  .src( 'data/tone-marks/*.json' )
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('02-dico-tone-marks.json', mergeData('tm')) )

  const shortVowels = gulp
  .src( 'data/vowels/short/*.json' )
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('03-dico-short-vowels.json', mergeData('vs')) )

  const longVowels = gulp
  .src( 'data/vowels/long/*.json' )
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('04-dico-long-vowels.json', mergeData('vl')) )

  const shortDiphtongs = gulp
  .src( 'data/diphtongs/short/*.json' )
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('05-dico-short-diphtongs.json', mergeData('ds')) )

  const longDiphtongs = gulp
  .src( 'data/diphtongs/long/*.json' )
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('06-dico-long-diphtongs.json', mergeData('dl')) )

  const shortGlides = gulp
  .src( 'data/glides/short/*.json' )
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('07-dico-short-glides.json', mergeData('gs')) )

  const longGlides = gulp
  .src( 'data/glides/long/*.json' )
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('08-dico-long-glides.json', mergeData('gl')) )

  const miscellaneous = gulp
  .src( 'data/miscellaneous/*.json' )
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('09-dico-miscellaneous.json', mergeData('m')) )

  const numbers   = gulp
  .src( 'data/numbers/*.json' )
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('10-dico-numbers.json', mergeData('n')) )

  return mergeStream(
    cons,
    toneMarks,
    shortVowels,
    longVowels,
    shortDiphtongs,
    longDiphtongs,
    shortGlides,
    longGlides,
    miscellaneous,
    numbers
  )
  .pipe( gulp.dest('js/models') )
  .pipe( $.plumber(onError) )
  .pipe( $.jsoncombine('dico-all.js', data => {
    // fix dictionaries that arrive in random order
    const dictionaries = Object.keys(data).sort()
    const result = dictionaries.reduce( (accumulator, dictionary) => {
      return accumulator.concat( data[dictionary] )
    }, [] )
    return new Buffer( JSON.stringify(result, null, 2) )
  }) )
  .pipe( $.defineModule('es6') )
  .pipe( gulp.dest('js/models') )

}
data.description = `update Thai dictionary to be consummable by the JS front application`

//----- ALL JS

const js = gulp.series(
  data,
  jsApp
)
js.description = `build JS files`

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

const cleanIcon     = require( `gulp-cheerio-clean-svg` )
const svgTemplates  = [
  `default-svg`,
  `default-css`,
  `default-demo`,
]

//----- CHARACTERS
const characters = () => {
  return gulp
  .src( `characters/*.svg` )
  .pipe( $.cheerio({
    run: $ => {
      // remove Affinity Designer's rectangle  wrapper
      const $rects  = $( `svg > rect` )
      $rects.each( (i, el) => {
        const $el   = $(el)
        const style = $el.attr(`style`)
        // test if it's the empty background rect or part of the char
        if (style !== `fill:none;`) return
        const content   = $el.html()
        $el.replaceWith( content )
      })
    },
    parserOptions: {
      xmlMode: true,
    },
  }) )
  .pipe( $.svgSymbols({
    id:       `char-%f`,
    class:    `.char-%f`,
    fontSize: 16,
    templates: svgTemplates,
  }) )
  .pipe( $.rename({basename: `svg-chars`}) )
  .pipe( $.if( /[.]svg$/, gulp.dest(`dist`)) )
  .pipe( $.if( /[.]svg$/, gulp.dest(`.tmp`)) )
  .pipe( $.if( /[.]html$/, gulp.dest('.tmp')) )
  .pipe( $.if( /[.]css$/, gulp.dest(`css`)) )
}
characters.description = `bundle SVG characters`

//----- ICONS (not used for now)

const icons = () => {
  return gulp
  .src( `icons/*.svg` )
  .pipe( $.cheerio({
    run: $ => {
      // remove Google's background path
      $( `path[fill=none]` ).remove()
    },
    parserOptions: {
      xmlMode: true,
    },
  }) )
  .pipe( $.rename( path => {
    const { basename }    = path
    const materialNameReg = /ic_([^\d]*)_black_24px/
    const isMaterialIcon  = materialNameReg.test(basename)
    if (!isMaterialIcon) return
    path.basename = materialNameReg.exec(basename)[1].replace(/_/g, `-`)
  }) )
  .pipe( $.cheerio(cleanIcon()) )
  .pipe( $.svgSymbols({
    id:         `icon-%f`,
    class:      `.icon-%f`,
    templates:  svgTemplates,
    svgAttrs:   { class: `svg-icon-library` },
  }) )
  .pipe( $.rename({basename: `svg-icons`}) )
  .pipe( $.if( /[.]svg$/, gulp.dest('html')) )
  .pipe( $.if( /[.]html$/, gulp.dest('.tmp')) )
  .pipe( $.if( /[.]css$/, gulp.dest('css')) )
}
icons.description = `bundle SVG files`

//----- APP ICON

const touchIcon = () => {
  const basename    = 'touch-icon'
  const iconSource  = isProd ? 'data/ios.png' : 'data/ios-dev.png'
  return gulp
  .src( iconSource )
  .pipe( $.imageResize({width: 192, height: 192, upscale: true}) )
  .pipe( $.rename( path =>  path.basename = `launcher-icon-${basename}-4x` ) )
  .pipe( gulp.dest(buildDir) )
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
  console.log( {newVersion, version})
  return gulp
  .src( 'manifest.json' )
  .pipe( $.jsonEditor({name: appTitle, version: newVersion || version }) )
  .pipe( gulp.dest(buildDir) )
}
webManifest.description = `copy the web manifest to the right place`

const assets = gulp.parallel( characters, icons, webManifest, touchIcon )
assets.description = `build every assets`

////////
// HTML
////////

const html = () => {
  return gulp
  .src( 'html/index.pug' )
  .pipe( $.pug({
    pretty: isDev,
    locals: {
      env,
      appTitle,
    }
  }) )
  .pipe( gulp.dest(buildDir) )
  .pipe( $.rename('200.html') )
  .pipe( gulp.dest(buildDir) )
}
html.description = `build index.html`

////////
// MISC
////////

const clean = () => del( `${buildDir}/*` )
clean.description = `clean everything in the destination folder`

////////
// DEV
////////

const showBundleSize = () => {
  return gulp
  .src( [`${buildDir}/*.js`, `${buildDir}/*.css`] )
  .pipe( $.size({gzip: true, showFiles: true}) )
}

const build = gulp.series(
  clean,
  // assets first for css to include the right SVG files
  assets,
  gulp.parallel( js, css, html ),
  workboxSW
)
build.description = `build everything (--prod for prod ^^)`

const buildProd = gulp.series(
  build,
  showBundleSize
)
buildProd.description = `build everything (prod)`

const connectLogger   = require( `connect-logger` )
const historyFallback = require( `connect-history-api-fallback` )
const bs = () => {
  return browserSync.init({
    open: false,
    server: {
      baseDir:  `./${buildDir}`,
      index:    `index.html`,
      https:    true,
      middleware: [
        connectLogger(),
        // Fallback to index.html for applications that are using the HTML 5 history API
        historyFallback(),
      ],
    }
  })
}

let hash
const watch = () => {
  gulp.watch( `manifest.json`,                    webManifest )
  gulp.watch( `.tmp/manifest.json`,               reload )
  gulp.watch( `data/**/*.json`,                   data )
  gulp.watch( `css/**/*.styl`,                    css )
  gulp.watch( `html/*`,                           html )
  gulp.watch( `characters/*.svg`,                 characters )
  gulp.watch( `icons/*.svg`,                      icons )
  gulp.watch( `js/thailpha-service-worker.js`,    serviceWorker )
  gulp.watch( `.tmp/thailpha-service-worker.js`,  reload )
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
  gulp.series( build, bsAndWatch )
dev.description = `build, watch & launch a dev server`

////////
// DEPLOY
////////

function askVersion() {
  return inquirer
  .prompt([
    {
      name:     `newVersion`,
      message:  `version number? (actual is ${version})`,
      validate: value => /\d+\.\d+\.\d+/.test(value),
    }
  ])
  .then( result => {
    newVersion = result.newVersion
    console.log( result )
    return true
  })
}
exports.askVersion = askVersion

function bump() {
  return gulp
  .src( `*.json` )
  .pipe( $.jsonEditor({version: newVersion}) )
  .pipe( gulp.dest(`.`) )
}

const deploy = gulp.series(
  askVersion,
  bump,
  buildProd,
)

gulp.task( `html`,        html )
gulp.task( `css`,         css )
gulp.task( `data`,        data )
gulp.task( `js`,          js )
gulp.task( `js:app`,      jsApp )
gulp.task( `js:workbox`,  workboxSW )
gulp.task( `characters`,  characters )
gulp.task( `icons`,       icons )
gulp.task( `touch-icon`,  touchIcon )
gulp.task( `manifest`,    webManifest )
gulp.task( `assets`,      assets )
gulp.task( `clean`,       clean )
gulp.task( `build`,       build )
gulp.task( `build:prod`,  buildProd )
gulp.task( `dev`,         dev )
gulp.task( `watch`,       watch )
gulp.task( `deploy`,      deploy )
