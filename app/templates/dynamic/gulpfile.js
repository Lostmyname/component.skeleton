'use strict';

var fs = require('fs');
var spawn = require('child_process').spawn;

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var browserify = require('browserify');
var browserSync = require('browser-sync');
var delve = require('delve');
var nunjucks = require('nunjucks');
var objToAttrs = require('obj-to-attrs');
var source = require('vinyl-source-stream');
var stylish = require('jshint-stylish');
var yaml = require('js-yaml');

var dieOnError = true;

function onError(err) {
  browserSync.notify(err.message, 3000);
  this.emit('end'); // jshint ignore: line
}

// Run this when you're working on the Gulpfile. Otherwise, do not use.
gulp.task('auto-reload', function () {
  var process;
  var args = ['default'];

  function restart() {
    if (process) {
      process.kill();
    }

    process = spawn('gulp', args, { stdio: 'inherit' });
  }

  gulp.watch('gulpfile.js', restart);
  restart();

  args.push('--no-open');
});

gulp.task('js-quality', function () {
  var stream = gulp.src('./src/js/**/*.js');

  if (!dieOnError) {
    stream = stream.pipe(plugins.plumber({ errorHandler: onError }));
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
    .pipe(plugins.compass({
      css: './demo/build',
      sass: './src/scss'
    }))
    .on('error', onError) // For some reason gulp-plumber doesn't like -compass
    .pipe(plugins.plumber())
    .pipe(plugins.autoprefixer())
//    .pipe(plugins.minifyCss())
    .pipe(gulp.dest('./demo/build'));
});

gulp.task('html', function (done) {
  var base = fs.readFileSync('demo/base.erb.html', 'utf8');
  var partial = fs.readFileSync('src/partials/partial.erb.html', 'utf8');

  base = base.replace('<%= "<%=" %> partial %>', partial);

  var env = nunjucks.configure({
    tags: {
      variableStart: '<%= "<%=" %>',
      variableEnd: '%>'
    }
  });

  var lang = yaml.safeLoad(fs.readFileSync('src/en.yml', 'utf8'));

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  var context = {
    name: 'sarah',
    t: function translate(text) {
      return delve(lang.en['component.<%= name %>'], text);

    },
    image_path: function (path) {
      return getImagePath(path);
    },
    image_tag: function (path, options) {
      path = getImagePath(path);
      return '<img src="' + path + '" ' + objToAttrs(options) + '>';
    }
  };
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

  function getImagePath(path) {
    return '../../src/imgs/' + path;
  }

  // HELL
  env.renderString(base, context, function (err, res) {
    if (err) {
      return done(err);
    }

    fs.mkdir('demo/partials', function (err) {
      if (err && err.code !== 'EEXIST') {
        return done(err);
      }

      fs.writeFile('demo/partials/partial.html', res, function (err) {
        if (err) {
          return done(err);
        }

        done();
      });
    });
  });
});

gulp.task('default', ['html', 'js', 'scss'], function () {
  dieOnError = false;

  var config = {
    server: {
      baseDir: '.'
    },
    startPath: '/demo/index.html',
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
    'demo/**/*.css',
    'demo/build/**/*.js',
    'demo/**/*.html',
    'test/**/*.js'
  ], config);

  gulp.watch('./src/scss/**/*.{sass,scss}', ['scss']);
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/partials/partial.mustache.html', ['html']);
});
