'use strict';
var path = require('path'),
    glob = require('glob');

var routes = glob.sync(path.join(__dirname, '..', '..', 'routes', '*.js'));

exports.create = function (app) {
	routes.forEach(function (route) {
		require(route).create(app);
	});
};
