'use strict';

var session_store = require('../lib/session_store.js');

var session_channel = app.ws.ch.registerChannel('session');

module.exports = session_channel;

session_channel.on('connection', function (session_stream) {
	session_stream.on('data', function (session_id) {
		session_id = app.config.session.prefix + session_id;
		session_store.client.get(session_id)(handleSession);
		function handleSession(err, session) {
			if (err) console.error(err);
			session_stream.write(session);
		}
	});
});
