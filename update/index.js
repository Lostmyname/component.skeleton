'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var copyFiles = require('../lib/copy-files');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log(yosay(
      'Welcome to the wondrous ' + chalk.red('lmn-component') + ' generator! ' +
      'Updating the gulpfile now :)'
    ));
  },

  writing: {
    writing: function () {
      var name = require(this.destinationPath('package.json')).name.slice(4);

      this.promptProps = { name: name };

      var toCopyDynamic = [
        'gulp-tasks/html.js',
        'gulp-tasks/js.js'
      ];

      copyFiles(toCopyDynamic, '../../app/templates/dynamic/', this);

      var toCopyStatic = [
        'gulpfile.js',
        'gulp-tasks/auto-reload.js',
        'gulp-tasks/default.js',
        'gulp-tasks/js-quality.js',
        'gulp-tasks/scss.js'
      ];

      copyFiles(toCopyStatic, '../../app/templates/static/', this);
    }
  },

  end: function () {
    this.log(chalk.green.bold('\nUpdated your component!'));
    this.log('The changes haven\'t been committed automatically. ' +
      'Check them first and then commit them');
  }
});
