'use strict';
var page = require('page');

var router = require('../router');

var pages = {};

require('./routes/wall');

function route(name) {
	return router(require('./routes/' + name), function (route) {
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
	console.log('404', context);
});

setTimeout(page.start, 0);
