'use strict';
/*global app*/
var page = require('page');

var router = require('./lib/router.js');

var pages = module.exports = {};

function route(name) {
	return router(app.ui.views[name], function (route) {
		route.name = name;
	});
}

pages.wall = function (path) {
	page(path, route('wall'));
};

pages.wall('/');
pages.wall('/:owner');
pages.wall('/:owner/:wall');

page('*', function (context) {
	console.error('404', context);
});

setTimeout(page.start, 0);
