'use strict';

var session_store = require('../lib/session_store.js');

var session_channel = app.ws.ch.registerChannel('session');

module.exports = session_channel;

session_channel.on('connection', function (session_stream) {
	session_stream.on('data', function (session_id) {
		session_store.get(session_id, function (err, session) {
			if (err) console.error(err);
			session_stream.write(JSON.stringify(session || {}));
		}, true);
	});
});
