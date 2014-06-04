'use strict';
var path = require('path'),
    browserify = require('browserify-middleware');

exports.create = function (app) {
	var bundle = browserify(path.join(__dirname, '..', '..', 'client', 'index.js'), {
		watch: 'dynamic',
		transform: ['browserify-hogan', 'reactify', 'bulkify']
	});
	app.get('/client.js', bundle);
};
