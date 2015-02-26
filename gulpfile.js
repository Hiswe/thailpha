'use strict';

var fs          = require('fs');
var args        = require('yargs').argv;
var mergeStream = require('merge-stream');
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var run         = require('run-sequence');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
// Browserify dependencies
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');

var dist        = 'dist';
var assets      = dist + '/assets';

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

// usefull packages for after
// https://www.npmjs.com/package/mithrilify

// browserify
var libs = [
  'mithril',
  'fastclick',
  'viewport-units-buggyfill',
];
var basedir = __dirname + '/js';

// Libs
gulp.task('lib', function() {
  return browserify({
    basedir: basedir
  })
  .require(libs)
  .bundle()
  .pipe(source('lib-dev.js'))
  .pipe(gulp.dest(dist))
  .pipe($.streamify($.uglify()))
  .pipe($.rename('lib.js'))
  .pipe(gulp.dest(dist));
});

// application
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
  .pipe(source('thailpha-dev.js'))
  .pipe(gulp.dest(dist))
  .pipe(reload({stream:true}))
  .pipe($.streamify($.uglify()))
  .pipe($.streamify($.stripDebug()))
  .pipe($.rename('thailpha.js'))
  .pipe(gulp.dest(dist));
});

// stylus to css
gulp.task('css', function() {
  var filterMapFile = $.filter(['*', '!*.map']);
  return gulp.src('css/index.styl')
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.sourcemaps.init())
    .pipe($.stylus())
    .pipe($.autoprefixer({debug: true}))
    .pipe($.rename('thailpha-dev.css'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(dist))
    .pipe(reload({stream:true}))
    .pipe(filterMapFile)
    .pipe($.cssmin())
    .pipe($.rename('thailpha.css'))
    .pipe(gulp.dest(dist));
});

gulp.task('touch-icon', function() {
  var basename    = 'touch-icon-';
  return gulp.src('data/ios.png')
    .pipe($.imageResize({width: 180, height: 180, upscale: true}))
    .pipe($.rename(function (path){ path.basename = basename + 'iphone-6-plus'}))
    .pipe(gulp.dest(dist))
    .pipe($.imageResize({width: 152, height: 152, upscale: true}))
    .pipe($.rename(function (path){ path.basename = basename + 'ipad-retina'}))
    .pipe(gulp.dest(dist))
    .pipe($.imageResize({width: 120, height: 120, upscale: true}))
    .pipe($.rename(function (path){ path.basename = basename + 'iphone-retina'}))
    .pipe(gulp.dest(dist))
    .pipe($.imageResize({width: 76, height: 76, upscale: true}))
    .pipe($.rename(function (path){ path.basename = basename + 'icon-ipad'}))
    .pipe(gulp.dest(dist))
    .pipe($.imageResize({width: 57, height: 57, upscale: true}))
    .pipe($.rename(function (path){ path.basename = basename + 'icon-iphone'}))
    .pipe(gulp.dest(dist))
});

// app-cache manifest
gulp.task('manifest', function(){
  return gulp.src([
    'dist/**/*',
    '!dist/*-dev.*',
    '!dist/touch-icon-*',
  ])
  .pipe($.manifest({
    timestamp: true,
    preferOnline: true,
    network: ['http://*', 'https://*', '*'],
    filename: 'cache.manifest',
    exclude: 'cache.manifest'
   }))
  .pipe(gulp.dest(dist));
});

// all together
gulp.task('build', function(cb) {
  return run('data', ['touch-icon', 'app', 'lib', 'css'], 'manifest', cb);
});

////////
// DEV
////////

gulp.task('browser-sync', function() {
  browserSync({
    open: false,
    server: {
      baseDir:  './dist',
      index:    'index-dev.html',
    }
  });
});

gulp.task('watch', function() {
  gulp.watch('data/**/*.json',  ['data']);
  gulp.watch('css/**/*.styl',   ['css']);
  gulp.watch([
    'js/**/*.js',
    'package.json',
    ],                          ['app']);
  gulp.watch([
    'dist/*',
    '!dist/cache.manifest',
    '!dist/*-dev.*'],           ['manifest']);
});

gulp.task('dev', function(cb) {
  if (args.build === false) {
    return run(['browser-sync', 'watch']);
  }
  return run('build', ['browser-sync', 'watch']);
});

////////
// DOC
////////

gulp.task('doc', function(cb) {
  var m = $.util.colors.magenta;
  var g = $.util.colors.grey;
  console.log(m('css'), g('...............'), 'compile Stylus files to distribution');
  console.log(m('app'), g('...............'), 'bundle js files to distribution');
  console.log(m('lib'), g('...............'), 'bundle js libraries files distribution');
  console.log(m('touch-icon'), g('........'), 'resize touch-icon image for mobile');
  console.log(m('manifest'), g('..........'), 'generate appcache manifest');
  console.log(m('build'), g('.............'), 'everything above');
  console.log(m('dev'), g('...............'), 'build, launch local server + watch files');
  console.log(m('  --no-build'), g('......'), 'Skip asset building. !! building should have be done before');
  console.log(m('bump'), g('..............'), 'patch version of json');
  console.log(m('  --minor'), g('.........'), 'minor version of ↑');
  console.log(m('  --major'), g('.........'), 'major version of ↑');
  return cb();
});

gulp.task('default', ['doc']);
