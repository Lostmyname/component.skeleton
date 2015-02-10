'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var spawn = require('child_process').spawn;

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log(yosay(
      'Welcome to the wondrous ' + chalk.red('lmn-component') + ' generator! ' +
      'Removing old npm dependencies now'
    ));
  },

  writing: {
    writing: function () {

      var old = [
        'delve', 'find-node-modules', 'gulp-autoprefixer', 'gulp-changed',
        'gulp-clone', 'gulp-compass', 'gulp-gm', 'gulp-if', 'gulp-imagemin',
        'gulp-jscs', 'gulp-jshint', 'gulp-load-plugins', 'gulp-minify-css',
        'gulp-plumber', 'gulp-raster', 'gulp-rename', 'gulp-rev', 'gulp-sass',
        'gulp-util', 'imagemin-jpegoptim', 'js-yaml', 'jscs', 'lodash',
        'merge-stream', 'jshint-stylish', 'nunjucks', 'obj-to-attrs',
        'rubbish-erb-parser', 'vinyl-buffer', 'vinyl-source-stream'
      ];

      var done = this.async();
      var spawn = require('child_process').spawn;
      var child = spawn('npm', ['rm', '--save-dev'].concat(old));

      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);

      child.on('close', function () {
        var child = spawn('npm', ['install', '--save-dev', 'lmn-gulp-tasks']);
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);

        child.on('close', function () {
          done();
        });
      });
    }
  },

  end: function () {
    this.log(chalk.green.bold('\nUpdated your component!'));
    this.log('The changes haven\'t been committed automatically. ' +
    'Check them first and then commit them');
  }
});
