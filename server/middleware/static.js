'use strict';
var path = require('path'),
    serveStatic = require('serve-static');

exports.create = function (app) {
	app.use(serveStatic(path.join(__dirname, '..', '..', 'client', 'static')));
};
