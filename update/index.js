'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var spawn = require('child_process').spawn;
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
      var done = this.async();

      var name = require(this.destinationPath('package.json')).name.slice(4);

      this.promptProps = { name: name };
      copyFiles(['gulpfile.js'], '../../app/templates/dynamic/', this);

      this.fs.delete(this.destinationPath('gulp-tasks'));

      var child = spawn('npm', ['install', '--save-dev', 'browser-sync']);
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);

      child.on('close', function () {
        done();
      });
    }
  },

  end: function () {
    this.log(chalk.green.bold('\nUpdated your component!'));
    this.log('The changes haven\'t been committed automatically. ' +
      'Check them first and then commit them');
  }
});
