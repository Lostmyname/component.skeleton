'use strict';

module.exports = function (toCopy, startPath, yeoman) {
  toCopy.forEach(function (file) {
    var from, to;

    if (Array.isArray(file)) {
      from = file[0];
      to = file[1];
    } else {
      from = to = file;
    }

    yeoman.fs.copyTpl(
      yeoman.templatePath(startPath + from),
      yeoman.destinationPath(to),
      yeoman.promptProps,
      { interpolate: /\{\{(.+?)\}\}/g, evaluate: /\{\%(.+?)\%\}/g }
    );
  });
};
