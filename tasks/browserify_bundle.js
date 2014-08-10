/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/
'use strict';

var gulp          = require('gulp');
// var watchify      = require('watchify');
var browserify    = require('browserify');
var sourceStream  = require('vinyl-source-stream');
var bundle_logger = require('./lib/bundle_logger');
var handle_errors = require('./lib/handle_errors');

var // path = require('path'),
		// browserify = require('browserify-middleware'),
		browserifyHogan = require('browserify-hogan'),
		bulkify = require('bulkify'),
		reactify = require('reactify');

gulp.task('browserify_bundle', function () {

	// var bundleMethod = global.is_watching ? watchify : browserify;

	var bundle_options = {
		// gzip: true,
		debug: true,
		minify: true,
		entries: [__dirname + '/../client/index.js']
		// precompile: true,
		// transform: [
			// browserifyHogan,
			// configReactify,
			// bulkify
		// ]
	};

	// function configReactify(file) {
	// 	return reactify(file, {es6: false});
	// }
	console.log('got here');
	var bundler = browserify(
		// __dirname + '/../client/index.js',
		bundle_options);
	// var bundler = bundleMethod({
		// Specify the entry point of your app
		// entries: [__dirname + '/../client/index.js'],
		// Add file extentions to make optional in your requires
		// extensions: ['.coffee', '.hbs'],
		// Enable source maps!
		// debug: true
	// });
	bundler.transform({}, browserifyHogan);
	bundler.transform({es6: false}, reactify);
	bundler.transform({}, bulkify);

	function bundle() {
		// Log when bundling starts
		bundle_logger.start();

		console.log('then here');
		return bundler
			.bundle()
			// Report compile errors
			.on('error', handle_errors)
			// Use vinyl-source-stream to make the
			// stream gulp compatible. Specifiy the
			// desired output filename here.
			.pipe(sourceStream('app.js'))
			// Specify the output destination
			.pipe(gulp.dest('./build/'))
			// Log when bundling completes!
			.on('end', bundle_logger.end);
	}

	// if (global.is_watching) {
		// Rebundle with watchify on changes.
		// bundler.on('update', bundle);
	// }

	console.log('and here');
	return bundle();
});
