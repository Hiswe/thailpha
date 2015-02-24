'use strict';

var fs          = require('fs');
var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var run         = require('run-sequence');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
// Browserify dependencies
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');

var dist        = 'dist'

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
    title: 'FROG',
    message: message,
    onLast: true
  };
};

var getVersion = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

////////
// BUILD
////////

// usefull packages for after
// https://www.npmjs.com/package/mithrilify

// browserify
var libs = [
  'mithril',
  // 'fastclick',
  // 'viewport-units-buggyfill',
];
var basedir = __dirname + '/js';

// NODE_ENV=production gulp lib
gulp.task('lib', function() {
  var browserifyLib = browserify({
    basedir: basedir
  })
  .require(libs)
  .bundle()
  .pipe(source('lib.js'))
  .pipe(gulp.dest(dist));
});

gulp.task('app', function () {
  browserify({
    basedir: basedir
  })
  .external(libs)
  .require(basedir + '/index.js', {
    expose: 'thailpha'
  })
  .bundle()
  .on('error', onError)
  .pipe(source('index.js'))
  // .pipe(gp.streamify(gp.uglify()))
  .pipe(gulp.dest(dist))
  .pipe(reload({stream:true}));
});


// stylus to css
gulp.task('css', function() {
  return gulp.src('css/index.styl')
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.stylus())
    .pipe($.autoprefixer())
    // .pipe($.cssmin())
    .pipe(gulp.dest(dist))
    .pipe(reload({stream:true}));
});

// all together
gulp.task('build', function(cb) {
  return run(['app', 'lib', 'css'], cb);
});

////////
// DEV
////////

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('watch', function() {
  gulp.watch('css/**/*.styl', ['css']);
  gulp.watch('js/*.js', ['app']);
});

gulp.task('dev', function(cb) {
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
  // console.log(m('manifest'), g('..........'), 'generate appcache manifest');
  console.log(m('build'), g('.............'), 'everything above');
  console.log(m('dev'), g('...............'), 'build, launch local server + watch files');
  // console.log(m('  --no-build'), g('......'), 'Skip asset building. !! building should have be done before');
  // console.log(m('bump'), g('..............'), 'patch version of json');
  return cb();
});

gulp.task('default', ['doc']);
