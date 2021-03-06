'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var exec = require('child-process-promise').exec;
var GitHubApi = require('github');
var bluebird = require('bluebird');

var copyFiles = require('../lib/copy-files');

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
      },
      {
        type: 'confirm',
        name: 'github',
        message: 'Would you like a GitHub repo to be created automatically?',
        default: true
      },
      {
        type: 'input',
        name: 'ghToken',
        message: 'Can I have a personal access token? (Settings -> Applications)',
        store: true,
        when: function (answers) {
          return answers.github;
        }
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
      var toCopy = [
        ['src/js/scripts.js', 'src/js/' + this.promptProps.name + '.js'],
        'src/en.yml',
        ['_gitignore', '.gitignore'],
        ['_package.json', 'package.json'],
        'gulpfile.js'
      ];

      copyFiles(toCopy, 'dynamic/', this);
    }
  },

  install: {
    git: function () {
      var done = this.async();
      var options = { cwd: this.destinationRoot() };

      this.log('\nInitialising git');

      return exec('git init', options)
        .then(function () {
          return exec('git add -A', options);
        })
        .then(function () {
          return exec('git commit -am "Added skeleton files"', options);
        })
        .then(function () {
          var that = this;

          this.log(chalk.green('Initialised git'));

          if (!this.promptProps.github) {
            done();
          } else {
            var github = new GitHubApi({ version: '3.0.0' });
            var org = 'Lostmyname';
            var repo = 'component.' + this.promptProps.name;

            github.authenticate({
              type: 'oauth',
              token: this.promptProps.ghToken
            });

            var createFromOrg = bluebird.promisify(github.repos.createFromOrg);

            createFromOrg({
              org: org,
              // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
              team_id: 316933,
              // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
              name: repo,
              description: this.promptProps.description
            })
              .catch(function (err) {
                that.log(chalk.red.bold('Failed to create GitHub repo:'), err);
              })
              .then(function () {
                var remote = 'git@github.com:' + org + '/' + repo + '.git';
                return exec('git remote add origin ' + remote);
              })
              .then(function () {
                return exec('git push -u origin master');
              })
              .then(function () {
                that.log(chalk.green('Successfully set up GitHub repo'));
              })
              .finally(function () {
                done();
              });
          }
        }.bind(this));
    },
    npm: function () {
      this.log('\nRunning npm install');
      this.npmInstall();
    }
  },

  end: function () {
    this.log(chalk.green.bold('\nGenerated your component!'));
    this.log('Now edit the README, run `gulp`, and start developing.');
  }
});
