'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the wondrous ' + chalk.red('lmn-component') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'What\'s the name of the component? (eg "gallery")',
        validate: function (input) {
          return /^[a-z\-.]+$/.test(input) ? true : '[a-z\\-.] only pls';
        },
        default: this.appname
      },
      {
        type: 'input',
        name: 'description',
        message: 'Please describe the component for the npm description'
      },
      {
        type: 'confirm',
        name: 'tests',
        message: 'Would you like tests?',
        default: true
      },
      {
        type: 'input',
        name: 'author',
        message: 'What\'s your GitHub username?',
        store: true
      }
    ];

    this.prompt(prompts, function (props) {
      this.promptProps = props;

      done();
    }.bind(this));
  },

  writing: {
    writing: function () {
      // Copy all non-dotfiles
      this.fs.copy(
        this.templatePath('static/**/*'),
        this.destinationRoot()
      );

      // Copy all dotfiles
      this.fs.copy(
        this.templatePath('static/.*'),
        this.destinationRoot()
      );

      // Delete test files if not needed
      if (!this.promptProps.tests) {
        this.fs.delete(this.destinationPath('demo/tests.html'));
        this.fs.delete(this.destinationPath('test'));
      }

      // All the other files!
      this.fs.copyTpl(
        this.templatePath('dynamic/package.json'),
        this.destinationPath('package.json'),
        this.promptProps
      );

      this.fs.copy(
        this.templatePath('dynamic/js/scripts.js'),
        this.destinationPath('js/' + this.promptProps.name + '.js')
      );

      this.fs.copyTpl(
        this.templatePath('dynamic/sass/styles.scss'),
        this.destinationPath('sass/styles.scss'),
        this.promptProps
      );

      this.fs.copy(
        this.templatePath('dynamic/sass/_skeleton.scss'),
        this.destinationPath('sass/_' + this.promptProps.name + '.scss')
      );

      this.fs.copyTpl(
        this.templatePath('dynamic/gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        this.promptProps
      );
    }
  },

  install: function () {
    //this.npmInstall();

    // @todo: Init git
  },

  end: function () {
    this.log('\n');
    this.log(chalk.green.bold('Generated your component!'));
    this.log('Now edit the README, run `gulp`, and start developing.');
  }
});
