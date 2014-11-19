'use strict';

var redis = require('redis');

var session_store = require('../lib/session_store.js');

var session_channel = app.ws.ch.registerChannel('session');

module.exports = session_channel;

var publisher = redis.createClient();

session_channel.on('connection', function (session_stream) {
	var connection = session_stream.conn,
	    channel = 'ws:' + connection.id,
	    client = redis.createClient();

	client.subscribe(channel);

	client.on('message', function (ch, message) {
		if (ch === channel) {
			connection.write(message);
		}
	});

	connection.channel = channel;
	connection.redis = client;

	connection.broadcast = function (topic, data) {
		var msg = 'msg,' + topic + ',' + data;

		session_store.client.keys('ws:*')(function (err, channels) {
			if (err) return;

			channels.forEach(function (ch) {
				if (ch === channel) return;

				publisher.publish(ch, msg);
			});
		});
	};

	connection.on('close', function () {
		session_store.client.del(channel)();

		client.quit();
	});

	session_stream.on('data', function (session_id) {
		session_id = app.config.session.prefix + session_id;

		session_store.client.get(session_id)(handleSession);

		function handleSession(err, session) {
			if (err) console.error(err);

			session = JSON.parse(session);
			session.ws_ch = channel;

			session = JSON.stringify(session);

			session_store.client.set(session_id, session)();
			session_store.client.setex(channel, 60 * 10, session_id)();

			connection.session = session;
			connection.session_id = session_id;

			session_stream.write(session);
		}
	});
});
