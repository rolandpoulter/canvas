'use strict';

var gulp = require('gulp'),
    // gutil = require('gulp-util'),
    webpack = require('gulp-webpack');

gulp.task('webpack_client', function () {
  var webpack_config = {

  };

  var compiler = webpack(webpack_config);

  // compiler.watch(200, function (err, stats) {
  //
  // });

  return gulp.src('client/index.js')
    .pipe(compiler)
    .pipe(gulp.dest('build/app.js'));
});
