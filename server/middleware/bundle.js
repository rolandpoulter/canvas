'use strict';
var path = require('path'),
    browserify = require('browserify-middleware'),
    browserifyHogan = require('browserify-hogan'),
    bulkify = require('bulkify'),
    reactify = require('reactify');

exports.create = function (app) {
	var config = app.config.bundle || {};

	var bundleOptions = {
		gzip: configBoolean(config, 'gzip', false),
		debug: configBoolean(config, 'debug', true),
		minify: configBoolean(config, 'minify', false),
		cache: config.cache || 'dynamic',
		precompile: true,
		transform: [
			browserifyHogan,
			configReactify.bind(null, config),
			bulkify
		]
	};

	var bundlePath = path.join(__dirname, '..', '..', 'client', 'index.js'),
	    bundle = browserify(bundlePath, bundleOptions);

	if (bundleOptions.minify) {
		bundleOptions.postminify = logHook('client.js build finished.');
	}
	else {
		bundleOptions.postcompile = logHook('client.js build finished.');
	}

	console.log('Bundling client.js', bundlePath);
	app.get('/js/client.js', bundle);
};

function configReactify(config, file) {
	return reactify(file, {es6: configBoolean(config, 'es6React')});
}

function configBoolean(config, name, value) {
	return config[name] === false ? false : value;
}

function logHook(message) {
	return function (source) {
		console.log(message);
		return source;
	};
}
