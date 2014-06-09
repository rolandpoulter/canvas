'use strict';
process.title = 'node' + require('../package.json').name + 'WebServer';

var bulk = require('bulk-require'),
    express = require('express');

exports.create = createWebServer;

if (module.main === module) {
	module.exports = createWebServer(require('../config'));
}

function createWebServer(config, domain) {
	/*jshint maxstatements: 20*/
	var app = express();
	app.domain = domain;
	app.config = config;
	app.mongo = require('mongoose').connect(config.mongo);
	app.model = bulk('model/*.js').model;
	app.events = new (require('events').EventEmitter)();

	app.use(require('response-time')());
	app.use(require('body-parser')());
	app.use(require('method-override')());
	app.use(require('cookie-parser')());
	app.use(require('express-session')({secret: 'lalafoofoo'}));
	app.use(require('errorhandler')());
	app.use(require('compression')());
	app.use(require('morgan')('dev'));

	var bulk_route_options = {require: function (middleware) {
		require(middleware).create(app);
	}};
	bulk(__dirname, ['middleware/*.js'], bulk_route_options);
	bulk(__dirname, ['middleware/deffered/*.js'], bulk_route_options);

	app.setupServer = function (web_server) {
		app.events.emit('setup_server', web_server);
	};

	return app;
}
