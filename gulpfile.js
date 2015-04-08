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
var dest          = {
  prod: 'dist',
  dev:  '.tmp',
};
var icon          = {
  prod: 'data/ios.png',
  dev:  'data/ios-dev.png',
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
  .pipe(function () { return $.streamify($.sourcemaps.init({loadMaps: true}));})
  .pipe(function () { return $.streamify($.sourcemaps.write('.')); });

var sourcemapsLib = lazypipe()
  .pipe(function () { return $.streamify($.sourcemaps.init({loadMaps: true}));})
  .pipe(concat)
  .pipe(function () { return $.streamify($.sourcemaps.write('.'));});

// LIBS
var libs = [
  'mithril',
  'fastclick',
  'viewport-units-buggyfill',
];
var basedir = __dirname + '/js';

gulp.task('lib', function() {
  var modernizr = gulp.src('html/modernizr.custom.js');
  var lib       = browserify({
    basedir: basedir,
    noParse:  libs,
    debug:    true,
  })
  .require(libs)
  .bundle()
  .pipe(source('lib.js'));

  return mergeStream(modernizr, lib)
  .pipe($.if(args.prod, compressLib(), sourcemapsLib()))
  .pipe(gulp.dest(dest[env]))
  .pipe(reload({stream:true}));
});

// APPLICATION
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
  .pipe($.if(args.prod, compress(), sourcemaps()))
  .pipe(gulp.dest(dest[env]))
  .pipe(reload({stream:true}));
});

// STYLUS TO CSS
var cssProd = lazypipe()
  .pipe($.stylus, { compress: true})
  .pipe($.autoprefixer);

var cssDev = lazypipe()
  .pipe($.sourcemaps.init)
    .pipe($.stylus, { compress: false})
    .pipe($.autoprefixer)
  .pipe($.sourcemaps.write, '.');

gulp.task('css', function() {
  return gulp
    .src('css/index.styl')
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.if(args.prod, cssProd(), cssDev()))
    .pipe(gulp.dest(dest[env]))
    .pipe($.filter(['*', '!*.map']))
    .pipe(reload({stream:true}));
});

// ICONS
gulp.task('touch-icon', function() {
  var basename = 'touch-icon-';
  return gulp.src([icon[env]])
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

// APP-CACHE MANIFEST
gulp.task('manifest', function(){
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
      pretty: env === 'dev',
      locals: {env: env}
    }))
    .pipe(gulp.dest(dest[env]));
});

gulp.task('clean', function (cb) {
  del(['dist'], cb);
});

// all together
gulp.task('build', function (cb) {
  if (env === 'prod') {
    return run(
      'clean',
      'data',
      ['touch-icon', 'html', 'app', 'lib', 'css'],
      'manifest',
      cb);
  }
  return run(
    'data',
    ['touch-icon', 'html', 'app', 'lib', 'css'],
    cb);
});

////////
// DEV
////////

gulp.task('browser-sync', function() {
  browserSync({
    open: false,
    server: {
      baseDir:  './' + dest['dev'],
      index:    'index.html',
    }
  });
});

gulp.task('watch', function() {
  gulp.watch('data/**/*.json',  ['data']);
  gulp.watch('css/**/*.styl',   ['css']);
  gulp.watch([
    'js/**/**/*.js',
    'package.json',
    ],                          ['app']);
});

gulp.task('dev', function(cb) {
  env = 'dev';
  if (args.build === false) {
    return run(['browser-sync', 'watch'], cb);
  }
  return run('build', ['browser-sync', 'watch'], cb);
});

////////
// DOC
////////

gulp.task('doc', function(cb) {
  var m = $.util.colors.magenta;
  var g = $.util.colors.grey;
  console.log(m('css'), g('………………………………………'), 'compile Stylus files to distribution');
  console.log(m('app'), g('………………………………………'), 'bundle js files to distribution');
  console.log(m('lib'), g('………………………………………'), 'bundle js libraries files distribution');
  console.log(m('touch-icon'), g('……………………'), 'resize touch-icon image for mobile');
  console.log(m('manifest'), g('…………………………'), 'generate appcache manifest');
  console.log(m('build'), g('…………………………………'), 'everything above');
  console.log(m('  --prod'), g('…………………………'), 'compress and bundle in dist folder');
  console.log(m('dev'), g('………………………………………'), 'build, launch local server + watch files');
  console.log(m('  --no-build'), g('………………'), 'Skip asset building. !! building should have be done before');
  console.log(m('bump'), g('……………………………………'), 'patch version of json');
  console.log(m('  --minor'), g('………………………'), 'minor version of ↑');
  console.log(m('  --major'), g('………………………'), 'major version of ↑');
  return cb();
});

gulp.task('default', ['doc']);
