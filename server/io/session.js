'use strict';

var session_store = require('../lib/session_store.js');

var session_channel = app.ws.ch.registerChannel('session');

module.exports = session_channel;

session_channel.on('connection', function (session_stream) {
	session_stream.on('data', function (session_id) {
		session_id = 'koa:sess:' + session_id;
		console.log('io getting session_id:', session_id);
		// try {
		// 	var session = session_store.get(session_id);
		// 	handleSession(null, session);
		// } catch (err) {
		// 	handleSession(err);
		// }
		session_store.client.get(session_id)(handleSession);
		function handleSession(err, session) {
			if (err) console.error(err);
			console.log('session:', session);
			// session_stream.write(JSON.stringify(session || {}));
			session_stream.write(session);
		}
	});
});
