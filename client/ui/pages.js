'use strict';
/*global app*/
var router = require('./lib/router.js');

function route(name) {
	return router(app.ui.views[name], function (route) {
		route.name = name;
	});
}

var page = require('page');

var pages = module.exports = {};

pages.wall = function (path) {
	page(path, route('wall'));
};

pages.wall('/');
pages.wall('/:owner');
pages.wall('/:owner/:wall');

page('*', function (context) {
	console.log('404', context);
});

setTimeout(page.start, 0);
