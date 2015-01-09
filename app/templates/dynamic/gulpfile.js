'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var stylish = require('jshint-stylish');

var dieOnError = true;

gulp.task('js-quality', function () {
  var stream = gulp.src('./src/js/**/*.js');

  if (!dieOnError) {
    stream = stream.pipe(plugins.plumber());
  }

  stream = stream.pipe(plugins.jscs())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish));

  if (dieOnError) {
    stream = stream.pipe(plugins.jshint.reporter('fail'));
  }

  return stream;
});

gulp.task('js', ['js-quality'], function () {
  var bundler = browserify('./src/js/<%= name %>.js');

  return bundler.bundle()
    .on('error', console.log.bind(console, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./demo/build'));
});

gulp.task('scss', function () {
  return gulp.src(['./src/scss/*.{sass,scss}', '!./src/scss/_*.{sass,scss}'])
    .pipe(plugins.plumber())
    .pipe(plugins.compass({
      css: './demo/build',
      sass: './src/scss'
    }))
    .pipe(plugins.autoprefixer())
//    .pipe(plugins.minifyCss())
    .pipe(gulp.dest('./demo/build'));
});

gulp.task('default', ['js', 'scss'], function () {
  dieOnError = false;

  browserSync.init([
    'demo/**/*.css',
    'demo/build/**/*.js',
    'demo/*.html',
    'test/**/*.js'
  ], {
    server: {
      baseDir: '.'
    },
    startPath: '/demo/index.html',
    ghostMode: {
      scroll: false,
      links: false,
      forms: false
    }
  });

  gulp.watch('./src/scss/**/*.{sass,scss}', ['scss']);
  gulp.watch(['./src/js/**/*.js'], ['js']);
});
