'use strict';

var entity_channel = app.ws.ch.registerChannel('entity');

module.exports = entity_channel;

entity_channel.on('connection', function (entity_stream) {
	entity_stream.on('data', function (data) {
		data = data.split('|');

		var method = data[0];

		if (method === 'get')
			return getEntities(entity_stream, data[1], JSON.parse(data[2]));

		if (method === 'set')
			return setEntity(entity_stream, data[1], data[2], JSON.parse(data[3]));
	});
});

function respond(method, entity_stream, callback_id, entity_json, error) {
	var msg = [method, callback_id, entity_json || ''];

	if (error) msg.push(error);

	entity_stream.write(msg.join('|'));
}

var Entity = require('../model/Entity');

function getEntities(entity_stream, callback_id, params) {
	Entity.all(params, function (err, entities) {
		respond(
			'get',
			entity_stream,
			callback_id,
			entities ? JSON.stringify(entities.map(toJSON)) : '[]',
			err && 'Failed to find entities.');
	});
	function toJSON(entity) { return entity.toJSON(); }
}

function setEntity(entity_stream, callback_id, id, entity) {
	if (id && !entity)
		return removeEntity(entity_stream, callback_id, id);

	if (id && entity) entity.id = id;

	Entity.upsert(entity, function (err, entity) {
		if (err) console.log(err);

		entity = JSON.stringify(entity && entity.toJSON());

		respond(
			'set',
			entity_stream,
			callback_id,
			entity,
			err && 'Failed to save entity: ' + id);

		entity_stream.conn.broadcast('entity',
			['update', entity].join('|'));
	});
}

function removeEntity(entity_stream, callback_id, id) {
	Entity.schema.adapter.destroy(Entity.modelName, id, function (err) {
		respond(
			'set',
			entity_stream,
			callback_id,
			JSON.stringify(!err),
			err && 'Failed to remove entity: ' + id);
	});
}
