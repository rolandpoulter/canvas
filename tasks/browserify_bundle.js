/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/
'use strict';

var gulp          = require('gulp');
var watchify      = require('watchify');
var browserify    = require('browserify');
var source        = require('vinyl-source-stream');
var bundle_logger = require('../util/bundleLogger');
var handle_errors = require('../util/handleErrors');

gulp.task('browserify_bundle', function () {

	var bundleMethod = global.is_watching ? watchify : browserify;

	var bundler = bundleMethod({
		// Specify the entry point of your app
		entries: ['./src/javascript/app.coffee'],
		// Add file extentions to make optional in your requires
		extensions: ['.coffee', '.hbs'],
		// Enable source maps!
		debug: true
	});

	var bundle = function () {
		// Log when bundling starts
		bundle_logger.start();

		return bundler
			.bundle()
			// Report compile errors
			.on('error', handle_errors)
			// Use vinyl-source-stream to make the
			// stream gulp compatible. Specifiy the
			// desired output filename here.
			.pipe(source('app.js'))
			// Specify the output destination
			.pipe(gulp.dest('./build/'))
			// Log when bundling completes!
			.on('end', bundle_logger.end);
	};

	if (global.is_watching) {
		// Rebundle with watchify on changes.
		bundler.on('update', bundle);
	}

	return bundle();
});
