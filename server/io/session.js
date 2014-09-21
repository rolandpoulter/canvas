'use strict';
var sessionStore = require('../lib/session_store.js');

exports.io = function (ws) {
	var session_channel = ws.ch.registerChannel('session');

	session_channel.on('connection', function (session_stream) {
		session_stream.on('data', function (session_id) {
			sessionStore.get(session_id, function (err, session) {
				if (err) console.error(err);
				session_stream.write(JSON.stringify(session || {}));
			}, true);
		});
	});
};
