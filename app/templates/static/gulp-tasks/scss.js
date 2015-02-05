'use strict';

var findNodeModules = require('find-node-modules');

module.exports = function (gulp, plugins) {
  return function () {
    return gulp.src(['./src/scss/*.{sass,scss}', '!./src/scss/_*.{sass,scss}'])
      .pipe(plugins.sass({
        imagePath: global.imagePath,
        includePaths: findNodeModules()
      }))
      .pipe(plugins.plumber())
      .pipe(plugins.autoprefixer())
      // .pipe(plugins.minifyCss())
      .pipe(gulp.dest(buildPath + 'stylesheets/'));
  };
};
