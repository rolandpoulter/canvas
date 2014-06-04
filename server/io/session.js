exports.io = function (ws, model, config) {
	var session = ws.ch.registerChannel('session');

	session.on('connection', function (session) {
		session.on('data', function (data) {});
	});
};
