'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

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

      this.fs.copyTpl(
        this.templatePath('../../app/templates/dynamic/gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        { name: name }
      );
    }
  },

  end: function () {
    this.log(chalk.green.bold('\nUpdated your component!'));
    this.log('The changes haven\'t been committed automatically. ' +
      'Check them first and then commit them');
  }
});
