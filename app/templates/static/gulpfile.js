  'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

global.dieOnError = true;
global.buildPath = './demo/build/';
global.imagePath = '../images';
global.imageSrc = [
  './src/**/*.{png,jpg,gif}'
];

global.onError = function (err) {
  browserSync.notify(err.message, 3000);
  this.emit('end'); // jshint ignore: line
};

function getTask(name) {
  return require('./gulp-tasks/' + name)(gulp, plugins);
}


gulp.task('auto-reload', getTask('auto-reload'));
gulp.task('html', getTask('html'));
gulp.task('js', ['js-quality'], getTask('js'));
gulp.task('js-quality', getTask('js-quality'));
gulp.task('scss', getTask('scss'));
gulp.task('responsive-images', getTask('responsive-images'));
gulp.task('optimise-svgs',     getTask('optimise-svgs'));

gulp.task('images',  ['responsive-images', 'optimise-svgs']);
gulp.task('build', ['html', 'scss', 'images']);
gulp.task('default', ['build'], getTask('default'));
