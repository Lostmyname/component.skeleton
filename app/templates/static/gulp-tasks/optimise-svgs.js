'use strict';

var mergeStream = require('merge-stream');

module.exports = function (gulp, plugins, constants) {
  return function () {

    var dest = buildPath + 'images/';

    var svgStream = gulp.src([
      './node_modules/lmn.jester.component.*/src/images/**/*.svg',
      './src/images/**/*.svg'
    ])
      // Optimise SVGs
      .pipe(plugins.rename({ dirname: '' }))
      .pipe(plugins.changed(dest))
      .pipe(plugins.imagemin({ svgoPlugins: [{ removeViewBox: false }] }))
      .pipe(gulp.dest(dest));

      // Make optimised PNG fallbacks
    var pngStream = svgStream.pipe(plugins.raster())
      .pipe(plugins.rename({ extname: '.png', dirname: '' }))
      .pipe(plugins.imagemin({ progressive: true }))
      .pipe(gulp.dest(dest));

  };
};
