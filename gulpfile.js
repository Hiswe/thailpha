'use strict'

const path = require('path')
const del = require('del')
const mergeStream = require('merge-stream')
const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const magenta = require('ansi-magenta')
const log = require('fancy-log')
const beeper = require('beeper')
const inquirer = require('inquirer')

const bc = require('./build-config')
const { version } = require('./package.json')
let newVersion = false
const bundler = webpack(require('./webpack.config.js'))

log(`environment is`, magenta(bc.env))
if (bc.isRelease) {
  log(`release mode to`, magenta(bc.releaseDest))
}

////////
// MISC
////////

// no arrow function: we're using `this`
function onError(err) {
  beeper()
  if (err.annotated) {
    log(err.annotated)
  } else if (err.message) {
    log(err.message)
  } else {
    log(err)
  }
  return this.emit('end')
}

////////
// JS
////////

//----- APPLICATION

const jsApp = done => {
  bundler.run((err, stats) => {
    // https://webpack.js.org/api/node/#error-handling
    if (err) return done(err)
    const info = stats.toJson()
    if (stats.hasErrors()) return done(info.errors)
    done()
  })
}
jsApp.description = `bundle the JS front application`

//----- DATA DICTIONNARY

const charType = {
  c: `isConsonant`,
  tm: `isToneMark`,
  vs: `isVowel`,
  vl: `isVowel`,
  ds: `isDiphtong`,
  dl: `isDiphtong`,
  gs: `isGlide`,
  gl: `isGlide`,
  m: `isMiscellanous`,
  n: `isNumber`,
}

const mergeData = prefix => data => {
  const letters = Object.keys(data)
  const result = letters.map((name, index) => {
    const letter = data[name]
    letter.id = `${prefix}-${index + 1}`
    letter[charType[prefix]] = true
    // normalize arrays
    ;[`similar`, `variant`].forEach(key => {
      const hasKey = Array.isArray(letter[key]) && letter[key].length
      const booleanKey = `has${key.charAt(0).toUpperCase() + key.substr(1)}`
      letter[booleanKey] = hasKey > 0
      letter[key] = letter[booleanKey] ? letter[key] : []
    })
    if (/^[vdg]l$/.test(prefix)) letter.isLong = true
    if (/^[vdg]s$/.test(prefix)) letter.isShort = true
    if (letter.meaning) {
      // letters don't have a 2 words rtgs
      const secondRtgsPart = letter.rtgs.split(' ')[1]
      letter.longMeaning = secondRtgsPart
        ? `${secondRtgsPart}: ${letter.meaning}`
        : ``
    }
    letter.longId = `${prefix}-${letter.rtgs.replace(' ', '-').toLowerCase()}`
    return letter
  })
  return new Buffer.from(JSON.stringify(result, null, 2))
}

const data = () => {
  const cons = gulp
    .src('data/consonants/*.json')
    .pipe($.plumber(onError))
    .pipe($.jsoncombine('01-dico-consonants.json', mergeData('c')))

  const toneMarks = gulp
    .src('data/tone-marks/*.json')
    .pipe($.plumber(onError))
    .pipe($.jsoncombine('02-dico-tone-marks.json', mergeData('tm')))

  const shortVowels = gulp
    .src('data/vowels/short/*.json')
    .pipe($.plumber(onError))
    .pipe($.jsoncombine('03-dico-short-vowels.json', mergeData('vs')))

  const longVowels = gulp
    .src('data/vowels/long/*.json')
    .pipe($.plumber(onError))
    .pipe($.jsoncombine('04-dico-long-vowels.json', mergeData('vl')))

  const shortDiphtongs = gulp
    .src('data/diphtongs/short/*.json')
    .pipe($.plumber(onError))
    .pipe($.jsoncombine('05-dico-short-diphtongs.json', mergeData('ds')))

  const longDiphtongs = gulp
    .src('data/diphtongs/long/*.json')
    .pipe($.plumber(onError))
    .pipe($.jsoncombine('06-dico-long-diphtongs.json', mergeData('dl')))

  const shortGlides = gulp
    .src('data/glides/short/*.json')
    .pipe($.plumber(onError))
    .pipe($.jsoncombine('07-dico-short-glides.json', mergeData('gs')))

  const longGlides = gulp
    .src('data/glides/long/*.json')
    .pipe($.plumber(onError))
    .pipe($.jsoncombine('08-dico-long-glides.json', mergeData('gl')))

  const miscellaneous = gulp
    .src('data/miscellaneous/*.json')
    .pipe($.plumber(onError))
    .pipe($.jsoncombine('09-dico-miscellaneous.json', mergeData('m')))

  const numbers = gulp
    .src('data/numbers/*.json')
    .pipe($.plumber(onError))
    .pipe($.jsoncombine('10-dico-numbers.json', mergeData('n')))

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
    .pipe(gulp.dest('js/models'))
    .pipe($.plumber(onError))
    .pipe(
      $.jsoncombine('dico-all.js', data => {
        // fix dictionaries that arrive in random order
        const dictionaries = Object.keys(data).sort()
        const result = dictionaries.reduce((accumulator, dictionary) => {
          return accumulator.concat(data[dictionary])
        }, [])
        return new Buffer.from(JSON.stringify(result, null, 2))
      })
    )
    .pipe($.defineModule('es6'))
    .pipe(gulp.dest('js/models'))
}
data.description = `update Thai dictionary to be consumable by the JS front application`

//----- ALL JS

const js = gulp.series(data, jsApp)
js.description = `build JS files`

////////
// ASSETS
////////

const cleanIcon = require(`gulp-cheerio-clean-svg`)
const svgTemplates = [`default-svg`, `default-css`, `default-demo`]

//----- CHARACTERS
const characters = () => {
  return gulp
    .src(`characters/*.svg`)
    .pipe(
      $.cheerio({
        run: $ => {
          // remove Affinity Designer's rectangle  wrapper
          const $rects = $(`svg > rect`)
          $rects.each((i, el) => {
            const $el = $(el)
            const style = $el.attr(`style`)
            // test if it's the empty background rect or part of the char
            if (style !== `fill:none;`) return
            const content = $el.html()
            $el.replaceWith(content)
          })
        },
        parserOptions: {
          xmlMode: true,
        },
      })
    )
    .pipe(
      $.svgSymbols({
        id: `char-%f`,
        class: `.char-%f`,
        fontSize: 16,
        templates: svgTemplates,
        svgAttrs: { class: `svg-icon-library` },
      })
    )
    .pipe($.rename({ basename: `svg-chars` }))
    .pipe($.if(/[.]svg$/, gulp.dest('html')))
    .pipe($.if(/[.]html$/, gulp.dest('.tmp')))
    .pipe($.if(/[.]css$/, $.rename({ extname: `.scss` })))
    .pipe($.if(/[.]scss$/, gulp.dest(`css`)))
}
characters.description = `bundle SVG characters`

//----- ICONS (not used for now)

const icons = () => {
  return gulp
    .src(`icons/*.svg`)
    .pipe(
      $.cheerio({
        run: $ => {
          // remove Google's background path
          $(`path[fill=none]`).remove()
        },
        parserOptions: {
          xmlMode: true,
        },
      })
    )
    .pipe(
      $.rename(path => {
        const { basename } = path
        const materialNameReg = /ic_([^\d]*)_black_24px/
        const isMaterialIcon = materialNameReg.test(basename)
        if (!isMaterialIcon) return
        path.basename = materialNameReg.exec(basename)[1].replace(/_/g, `-`)
      })
    )
    .pipe($.cheerio(cleanIcon()))
    .pipe(
      $.svgSymbols({
        id: `icon-%f`,
        class: `.icon-%f`,
        templates: svgTemplates,
        svgAttrs: { class: `svg-icon-library` },
      })
    )
    .pipe($.rename({ basename: `svg-icons` }))
    .pipe($.if(/[.]svg$/, gulp.dest('html')))
    .pipe($.if(/[.]html$/, gulp.dest('.tmp')))
    .pipe($.if(/[.]css$/, $.rename({ extname: `.scss` })))
    .pipe($.if(/[.]scss$/, gulp.dest('css')))
}
icons.description = `bundle SVG files`

const assets = gulp.parallel(characters, icons)
assets.description = `build every assets`

////////
// MISC
////////

const clean = () => del(`${bc.buildDir}/*`)
clean.description = `clean everything in the destination folder`

const showBundleSize = () => {
  return gulp
    .src([
      `${bc.buildDir}/*.js`,
      `${bc.buildDir}/*.css`,
      `${bc.buildDir}/*.html`,
    ])
    .pipe($.size({ gzip: true, showFiles: true }))
}

////////
// DEV
////////

const build = gulp.series(
  clean,
  // assets first for css to include the right SVG files
  assets,
  js
)
build.description = `build everything (--prod for prod ^^)`

const buildProd = gulp.series(build, showBundleSize)
buildProd.description = `build everything (prod)`

const webpackServerOptions = {
  contentBase: path.join(__dirname, bc.buildDir),
  historyApiFallback: true,
  stats: {
    colors: true,
  },
}

// https://github.com/webpack/docs/wiki/usage-with-gulp
const PORT = 3000
const webpackDevServer = done => {
  new WebpackDevServer(bundler, webpackServerOptions).listen(
    PORT,
    `localhost`,
    err => {
      if (err) return onError(err)
      log(`http://localhost:3000`)
    }
  )
}

let hash
const watch = () => {
  gulp.watch(`data/**/*.json`, data)
  gulp.watch(`characters/*.svg`, characters)
  gulp.watch(`icons/*.svg`, icons)
}
watch.description = `watch & rebuild on change`

const serveAndWatch = () => {
  webpackDevServer()
  watch()
}

const dev = bc.skipBuild ? serveAndWatch() : gulp.series(build, serveAndWatch)
dev.description = `build, watch & launch a dev server`

////////
// RELEASE
////////

function askVersion() {
  return inquirer
    .prompt([
      {
        name: `newVersion`,
        message: `version number? (actual is ${version})`,
        validate: value => /\d+\.\d+\.\d+/.test(value),
      },
    ])
    .then(result => {
      newVersion = result.newVersion
      return true
    })
}
exports.askVersion = askVersion

function bump() {
  return gulp
    .src([`package.json`, `manifest.json`])
    .pipe($.jsonEditor({ version: newVersion }))
    .pipe(gulp.dest(`.`))
}

const preRelease = bc.skipBump
  ? buildProd
  : gulp.series(askVersion, bump, buildProd)

gulp.task(`data`, data)
gulp.task(`js`, js)
gulp.task(`js:app`, jsApp)
gulp.task(`characters`, characters)
gulp.task(`icons`, icons)
gulp.task(`assets`, assets)
gulp.task(`clean`, clean)
gulp.task(`build`, build)
gulp.task(`build:prod`, buildProd)
gulp.task(`dev`, dev)
gulp.task(`watch`, watch)
gulp.task(`pre-release`, preRelease)
gulp.task(`ask-version`, askVersion)
