'use strict';

var entity_channel = app.ws.ch.registerChannel('entity');

module.exports = entity_channel;

entity_channel.on('connection', function (entity_stream) {
	entity_stream.on('data', function (data) {
		console.log('entity', data);
	});
});
