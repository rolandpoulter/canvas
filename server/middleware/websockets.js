'use strict';
var path = require('path'),
    glob = require('glob'),
    sockjs = require('sockjs'),
    multiplex_server = require('websocket-multiplex');

var io_messagers = glob.sync(path.join(__dirname, '..', 'io', '**', '*.js'));

exports.create = function (app) {
	app.ws = sockjs.createServer({
		sockjs_url: app.config.sockjs_url || 'http://cdn.sockjs.org/sockjs-0.3.min.js'
	});
	app.ws.ch = new multiplex_server.MultiplexServer(app.ws);

	io_messagers.forEach(function (messager) {
		require(messager).io(app.ws, app.model, app.config);
	});

	app.events.on('setup_server', function (web_server) {
		app.ws.installHandlers(web_server, {prefix: '/ws'});
	});
};
