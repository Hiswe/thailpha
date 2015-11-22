'use strict';

var fs            = require('fs');
var args          = require('yargs').argv;
var del           = require('del');
var mergeStream   = require('merge-stream');
var gulp          = require('gulp');
var $             = require('gulp-load-plugins')();
var run           = require('run-sequence');
var lazypipe      = require('lazypipe');
var browserSync   = require('browser-sync');
var reload        = browserSync.reload;
// Browserify dependencies
var browserify    = require('browserify');
var source        = require('vinyl-source-stream');

var dist          = 'dist';
var env           = args.prod ? 'prod' : 'dev';
var isDev         = env === 'dev';
var isProd        = !isDev;
var dest          = {
  prod: 'dist',
  dev:  '.tmp',
};
var dst           = {
  dev:    lazypipe().pipe(gulp.dest, '.tmp'),
  prod:   lazypipe().pipe(gulp.dest, 'dist'),
};

////////
// MISC
////////

function onError(err) {
  $.util.beep();
  if (err.annotated) {
    return $.util.log(err.annotated);
  }
  if (err.message) {
    return $.util.log(err.message);
  }
  return $.util.log(err);
};

function msg(message) {
  return {
    title: 'THAILPHA',
    message: message,
    onLast: true
  };
};

var getVersion = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

gulp.task('bump', function(){
  var type = args.major ? 'major' : args.minor ? 'minor' : 'patch';
  return gulp.src('./package.json')
    .pipe($.bump({type: type}))
    .pipe(gulp.dest('./'));
});

////////
// BUILD
////////

gulp.task('data', function() {

  function mergeData(prefix) {
    return function (data) {
      var letters = Object.keys(data);
      var result  = letters.map(function (name, index) {
        var letter      = data[name];
        letter.id       = prefix + (index + 1);
        letter.isVowel  = /^v/.test(letter.id);
        letter.longId   = prefix + letter.rtgs.replace(' ', '-');
        return letter;
      });
      return new Buffer(JSON.stringify(result, null, 2));
    }
  }

  var cons = gulp.src('data/consonants/*.json')
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.jsoncombine('dico-consonants.js', mergeData('c-')));

  var shortVowels = gulp.src('data/vowels/short/*.json')
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.jsoncombine('dico-short-vowels.js', mergeData('vs-')));

  var longVowels = gulp.src('data/vowels/long/*.json')
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.jsoncombine('dico-long-vowels.js', mergeData('vl-')));

  var numbers = gulp.src('data/numbers/*.json')
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.jsoncombine('dico-numbers.js', mergeData('n-')));

  return mergeStream(cons, shortVowels, longVowels, numbers)
    .pipe($.defineModule('commonjs'))
    .pipe(gulp.dest('js/models'));
});


////////
// JS
////////

var babelify      = require('babelify');
var vinylBuffer   = require('vinyl-buffer');
// usefull packages for after
// https://www.npmjs.com/package/mithrilify

var concat  = lazypipe()
  .pipe(function () { return $.streamify($.concat('thailpha-lib.js')); });

var compress = lazypipe()
  .pipe($.streamify, $.uglify)
  .pipe($.streamify, $.stripDebug);
  // .pipe($.gzip, { append: false });

var compressLib   = concat.pipe(compress);

var sourcemaps = lazypipe()
  .pipe($.sourcemaps.init, {loadMaps: true})
  .pipe($.sourcemaps.write, '.');

var sourcemapsLib = lazypipe()
  .pipe($.sourcemaps.init, {loadMaps: true})
  .pipe(concat)
  .pipe($.sourcemaps.write, '.');

var write = lazypipe()
  .pipe(gulp.dest, dest[env])
  .pipe(function () { return $.if(env === 'dev', reload({stream:true}));  });


//----- LIBRARIES

var libs = [
  'mithril',
  'fastclick',
  'viewport-units-buggyfill',
  'dominus',
  'inobounce',
  'pubsub-js',
  'velocity-animate',
];
var basedir = __dirname + '/js';

gulp.task('lib', function () {
  var modernizr = gulp.src('html/modernizr.custom.js');
  var lib       = browserify({
    basedir: basedir,
    noParse:  libs,
    debug:    true,
  })
  .require(libs)
  .bundle()
  .pipe(source('lib.js'))
  .pipe(vinylBuffer());

  return mergeStream(modernizr, lib)
  .pipe($.if(args.prod, compressLib(), sourcemapsLib()))
  .pipe(write());
});

//----- FRONT APPLICATION

gulp.task('app', function () {
  return browserify({
    basedir: basedir,
    debug: true,
  })
  .external(libs)
  .require(basedir + '/index.js', {
    expose: 'thailpha'
  })
  .bundle()
  .on('error', onError)
  .pipe(source('thailpha.js'))
  .pipe(vinylBuffer())
  .pipe($.if(args.prod, compress(), sourcemaps()))
  .pipe(write());
});

////////
// STYLUS TO CSS
////////

var cssDev        = lazypipe()
  .pipe(dst.dev)
  .pipe($.filter, ['*', '!*.map'])
  .pipe(reload, {stream: true});

var cssProd       = lazypipe()
  .pipe($.minifyCss)
  // .pipe(addBanner)
  .pipe(dst.prod)

gulp.task('css', function() {
  return gulp
    .src('css/index.styl')
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.if(isDev, $.sourcemaps.init()))
    .pipe($.stylus({
      'include css': true,
      define: {
        isProd: isProd,
      }
    }))
    .pipe($.autoprefixer())
    .pipe($.if(isDev, $.sourcemaps.write('.')))
    .pipe($.if(isDev, cssDev(), cssProd()));
    // .pipe(write());
});

////////
// ASSETS
////////

var cleanIcon = require('gulp-cheerio-clean-svg');

//----- ICONS

gulp.task('icons', function () {
  return gulp
    .src('icons/*.svg')
    // .pipe($.cheerio({
    //   run: function ($, file) { $('#bounds').remove(); },
    //   parserOptions: {
    //     xmlMode: true
    //   }
    // }))
    .pipe($.cheerio(cleanIcon()))
    .pipe($.svgSymbols({
      id: 'icon-%f',
      className: '.icon-%f',
    }))
    .pipe($.if( /[.]svg$/, gulp.dest('html')))
    .pipe($.if( /[.]css$/, gulp.dest('css')));
});

//----- APP ICON

gulp.task('touch-icon', function() {
  var basename    = 'touch-icon-';
  var iconSource  = env === 'prod' ? 'data/ios.png' : 'data/ios-dev.png';
  return gulp.src(iconSource)
    .pipe($.imageResize({width: 180, height: 180, upscale: true}))
    .pipe($.rename(function (path){ path.basename = basename + 'iphone-6-plus'}))
    .pipe(gulp.dest(dest[env]))
    .pipe($.imageResize({width: 152, height: 152, upscale: true}))
    .pipe($.rename(function (path){ path.basename = basename + 'ipad-retina'}))
    .pipe(gulp.dest(dest[env]))
    .pipe($.imageResize({width: 120, height: 120, upscale: true}))
    .pipe($.rename(function (path){ path.basename = basename + 'iphone-retina'}))
    .pipe(gulp.dest(dest[env]))
    .pipe($.imageResize({width: 76, height: 76, upscale: true}))
    .pipe($.rename(function (path){ path.basename = basename + 'icon-ipad'}))
    .pipe(gulp.dest(dest[env]))
    .pipe($.imageResize({width: 57, height: 57, upscale: true}))
    .pipe($.rename(function (path){ path.basename = basename + 'icon-iphone'}))
    .pipe(gulp.dest(dest[env]))
});


////////
// APP-CACHE MANIFEST
////////

gulp.task('manifest', function (){
  return gulp.src([
    dest[env] + '/**/*',
    '!' + dest[env] + '/*.html',
    '!' + dest[env] + '/touch-icon-*',
  ])
  .pipe($.manifest({
    timestamp: true,
    preferOnline: true,
    network: ['http://*', 'https://*', '*'],
    filename: 'cache.manifest',
    exclude: 'cache.manifest'
   }))
  .pipe(gulp.dest(dest[env]));
});

// HTML
gulp.task('html', function () {
  return gulp
    .src('html/index.jade')
    .pipe($.jade({
      pretty: isDev,
      locals: {env: env}
    }))
    .pipe(write());
});

gulp.task('clean', function (cb) {
  del(['dist'], cb);
});

// all together
gulp.task('build', function (cb) {
  if (env === 'prod') {
    return run(
      'clean',
      ['data', 'icons'],
      ['touch-icon', 'html', 'app', 'lib', 'css'],
      'manifest',
      cb);
  }
  return run(
    ['data', 'icons'],
    ['touch-icon', 'html', 'app', 'lib', 'css'],
    cb);
});

////////
// DEV
////////

gulp.task('browser-sync', function () {
  browserSync({
    open: false,
    server: {
      baseDir:  './' + dest['dev'],
      index:    'index.html',
    }
  });
});

gulp.task('watch', function () {
  gulp.watch('data/**/*.json',  ['data']);
  gulp.watch('css/**/*.styl',   ['css']);
  gulp.watch('html/*.jade',     ['html']);
  gulp.watch([
    'js/**/**/*.js',
    'package.json',
    ],                          ['app']);
});

gulp.task('dev', function (cb) {
  env = 'dev';
  if (args.build === false) {
    return run(['browser-sync', 'watch'], cb);
  }
  return run('build', ['browser-sync', 'watch'], cb);
});

////////
// DOC
////////

gulp.task('doc', function (cb) {
  var m = $.util.colors.magenta;
  var g = $.util.colors.grey;
  console.log(m('css'), g('………………………………………'), 'compile Stylus files');
  console.log(m('html'), g('……………………………………'), 'compile Html files');
  console.log(m('app'), g('………………………………………'), 'bundle js files');
  console.log(m('lib'), g('………………………………………'), 'bundle js libraries files');
  console.log(m('touch-icon'), g('……………………'), 'resize touch-icon image for mobile');
  console.log(m('manifest'), g('…………………………'), 'generate appcache manifest');
  console.log(m('build'), g('…………………………………'), 'everything above');
  console.log(m('  --prod'), g('…………………………'), 'compress and bundle in distribution folder');
  console.log(m('dev'), g('………………………………………'), 'build, launch local server + watch files');
  console.log(m('  --no-build'), g('………………'), 'skip asset building. !! building should have be done before');
  console.log(m('bump'), g('……………………………………'), 'patch version of json');
  console.log(m('  --minor'), g('………………………'), 'minor version of ↑');
  console.log(m('  --major'), g('………………………'), 'major version of ↑');
  return cb();
});

gulp.task('default', ['doc']);
