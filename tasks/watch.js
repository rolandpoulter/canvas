'use strict';
var gulp = require('gulp');

gulp.task('watch', ['set_watch', 'browser_sync'], function () {
	// gulp.watch('src/less/**', ['less']);
	// Note: The browserify task handles js recompiling with watchify
});
