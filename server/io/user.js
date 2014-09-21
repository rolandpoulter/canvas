'use strict';

var user_channel = app.ws.ch.registerChannel('user');

module.exports = user_channel;

user_channel.on('connection', function (user_stream) {
	user_stream.on('data', function (data) {
		console.log('user', data);
	});
});
