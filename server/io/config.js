exports.io = function (ws, model, _config) {
	var config = ws.ch.registerChannel('config'),
	    config_json = JSON.stringify(_config.client);

	config.on('connection', function (config) {
		config.write(config_json);
		config.on('data', function (data) {
			config.write(config_json);
		});
	});
};
