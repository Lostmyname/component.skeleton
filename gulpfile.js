'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

gulp.task('js', function () {
  var bundler = browserify('./js/scripts.js');

  return bundler.bundle()
    .on('error', console.log.bind(console, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./demo/build'));
});

gulp.task('sass', function () {
  return gulp.src(['sass/*.{sass,scss}', '!sass/_*.{sass,scss}'])
    .pipe(plugins.rubySass())
    .pipe(plugins.plumber())
    .pipe(plugins.autoprefixer())
//		.pipe(plugins.minifyCss())
    .pipe(gulp.dest('./demo/build'));
});

gulp.task('browser-sync', function () {
  browserSync.init([
    'demo/**/*.css',
    'demo/**/*.js',
    'demo/**/*.html',
    'test/**/*.js'
  ], {
    server: {
      baseDir: '.'
    }
  });
});

gulp.task('default', ['js', 'sass', 'browser-sync'], function () {
  gulp.watch('sass/**/*.{sass,scss}', ['sass']);
  gulp.watch(['js/**/*.js'], ['js']);
});
