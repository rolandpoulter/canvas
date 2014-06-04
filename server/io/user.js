exports.io = function (ws, model, config) {
	var user = ws.ch.registerChannel('user');

	user.on('connection', function (user) {
		user.on('data', function (data) {});
	});
};
