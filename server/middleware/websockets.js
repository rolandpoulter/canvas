'use strict';

var sockjs = require('sockjs');

var ws_multiplex = require('websocket-multiplex');

app.ws = sockjs.createServer({
	sockjs_url: app.config.sockjs_url ||
		'http://cdn.sockjs.org/sockjs-0.3.min.js'
});

app.ws.ch = new ws_multiplex.MultiplexServer(app.ws);

app.ws.on('connection', function (app_stream) {
	console.log('client websocket connection made.');

	// app_stream.on('data', function (data) {
	// 	console.log('received io message:', data);
	// });

	app_stream.on('close', function () {
		console.log('client websocket connection closed.');
	});
});

app.events.on('setup_server', function (web_server) {
	app.ws.installHandlers(web_server, {prefix: '/ws'});
});
