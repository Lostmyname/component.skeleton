'use strict';

var path = require('path');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var loadLmnTask = require('lmn-gulp-tasks');

var buildPath = './demo/build/';

gulp.task('auto-reload', loadLmnTask('auto-reload'));

gulp.task('html', loadLmnTask('html', {
  langBase: 'component.{{ name }}'
}));

gulp.task('js', ['js-quality'], loadLmnTask('browserify', {
  src: './src/js/{{ name }}.js',
  dest: './demo/build/bundle.js'
}));

gulp.task('js-quality', loadLmnTask('js-quality', {
  src: './src/js/**/*.js'
}));

gulp.task('scss', loadLmnTask('scss', {
  src: './src/scss/*.{sass,scss}',
  dest: path.join(buildPath, 'stylesheets'),
  imagePath: '../images'
}));

gulp.task('responsive-images', loadLmnTask('responsive-images', {
  src: './src/**/*.{png,jpg,gif}',
  dest: path.join(buildPath, 'images'),
  lossless: true
}));

gulp.task('optimise-svgs', loadLmnTask('optimise-svgs', {
  src: './src/**/*.svg',
  dest: path.join(buildPath, 'images'),
  flatten: true
}));

gulp.task('images', ['responsive-images', 'optimise-svgs']);
gulp.task('build', ['images', 'html', 'js', 'scss']);

gulp.task('default', ['build'], function () {
  var config = {
    server: {
      baseDir: '.'
    },
    startPath: '/demo/partials/partial.html',
    ghostMode: {
      scroll: false,
      links: false,
      forms: false
    }
  };

  if (process.argv.indexOf('--no-open') !== -1) {
    config.open = false;
  }

  browserSync.init([
    'demo/build/**/*.css',
    'demo/build/**/*.js',
    'demo/**/*.html',
    'src/imgs/**/*',
    'test/**/*.js'
  ], config);

  gulp.watch('./src/scss/**/*.{sass,scss}', ['scss']);
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/partials/partial.erb.html', ['html']);
  gulp.watch('./demo/base.erb.html', ['html']);
});
