'use strict';

var _ = require('lodash');
var jpegoptim = require('imagemin-jpegoptim');
var mergeStream = require('merge-stream');

module.exports = function (gulp, plugins, constants) {
  var dest = buildPath + 'images/';

  return function (done) {
    var images = gulp.src(global.imageSrc);
    var imageTasks = [];

    // Special case for retina images
    imageTasks.push(gulp.src([
      'src/images/**/*@2x*.{png,jpg,gif}'
    ])
      .pipe(handleRename('-xlarge'))
      .pipe(handleChange())
      .pipe(handleOptimize())
      .pipe(gulp.dest(dest))
    );

    var sizes = { large: 100, medium: 66.7, small: 50 };
    var i = 0;

    // Deal with each size separately
    _.each(sizes, function (factor, suffix) {
      imageTasks.push(images.pipe(plugins.clone())
        .pipe(handleRename('-' + suffix))
        .pipe(handleChange())
        .pipe(handleResize(factor))
        .pipe(handleOptimize())
        .pipe(gulp.dest(dest))
        .on('end', function () {
          if (++i === _.size(sizes)) {
            done();
          }
        })
      );
    });

  };

  function handleResize(factor) {
    return plugins.gm(function (gmfile) {
      var newFactor = _.contains(gmfile.source, '@2x') ? factor / 2 : factor;

      if (newFactor === 100) {
        return gmfile;
      }

      return gmfile.resize(newFactor, newFactor, '%');
    }, { imageMagick: true });
  }

  function handleRename(suffix) {
    return plugins.rename(function (path) {
      var matches = /^(.+)\-\d+[x-]\d+(?:@2x)?(?:(-[a-z]{2}(?:-[A-Z]{2})?))?$/.exec(path.basename);

      if (!matches) {
        var error = 'Failed to parse file name: ' + path.basename;
        throw new plugins.util.PluginError('Eagle', error);
      }

      path.basename = matches[1] + suffix + (matches[2] || '');
      path.dirname = '';
    });
  }

  function handleChange() {
    return plugins.changed(dest, {
      hasChanged: function (stream, cb, file, destPath) {
        destPath = destPath.replace(/\d+[x-]\d+(?:@2x)?(?=(?:-[a-z]{2}(?:-[A-Z]{2})?)?\.[a-z]+$)/, 'small');
        plugins.changed.compareLastModifiedTime(stream, cb, file, destPath);
      }
    });
  }

  function handleOptimize() {
    function containsHero(file) {
      return file.path.indexOf('hero') !== -1;
    }

    var lossyStream = plugins.imagemin({ use: [jpegoptim({ max: 80 })] });
    var losslessStream = plugins.imagemin({ progressive: true });

    return plugins['if'](containsHero, losslessStream, lossyStream);
  }
};
