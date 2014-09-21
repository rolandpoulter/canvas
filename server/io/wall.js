'use strict';

var wall_channel = app.ws.ch.registerChannel('wall');

module.exports = wall_channel;

wall_channel.on('connection', function (wall_stream) {
	wall_stream.on('data', function (data) {
		console.log('wall', data);
	});
});
