'use strict';

process.title = require('../package.json').name + 'WebServer';

var // qs = require('querystring'),
    bulk = require('bulk-require'),
    express = require('express');

exports.create = createWebServer;

if (module.main === module) {
	module.exports = createWebServer(require('../config'));
}

function createWebServer(config, domain) {
	var app = express();
	app.domain = domain;
	app.config = config;
	app.mongo = require('mongoose').connect(config.mongo);
	app.model = bulk('model/*.js').model;
	app.events = new (require('events').EventEmitter)();

	app.use(require('response-time')());
	// app.use(function (request, reponse, next) {
		// request.query = request.query || qs.parse(require.url.split('?')[1]);
		// next();
	// });
	app.use(require('body-parser')());
	app.use(require('method-override')());
	app.use(require('cookie-parser')());
	app.use(require('express-session')({secret: 'lalafoofoo'}));
	app.use(require('errorhandler')());
	app.use(require('compression')());
	app.use(require('morgan')('dev'));

	bulk(__dirname, ['middleware/**/*.js'], {require: function (middleware) {
		require(middleware).create(app);
	}});

	app.setupServer = function (web_server) {
		app.events.emit('setup_server', web_server);
	};

	return app;
}
