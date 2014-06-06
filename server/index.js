process.title = require('../package.json').name + 'Worker';

module.exports = main(require('../config'));

function main (config) {

	var cluster = require('cluster');

	var domain = require('domain').create();

	var app = require('./app.js').create(config, domain);

	var server = config.ssl ?
		require('https').createServer(config.ssl, app) :
		require('http').createServer(app);

	if (app.setupServer) {
		app.setupServer(server);
	}

	domain.on('error', function (error) {
		console.error(error.stack || error);
		reset();
	});

	domain.run(function () {
		var server_config = config.webserver;
		console.log(process.pid, 'Listening on ' + server_config.host + ':' + server_config.port);
		server.listen(server_config.port, server_config.host || '0.0.0.0');
	});

	return reset;

	function reset () {
		try {
			setTimeout(process.exit.bind(process, 1), 30000).unref();
			if (server) server.close();
			if (cluster.worker) {
				cluster.worker.disconnect();
			}
		}
		catch (error) {
			console.error(error.stack || error);
			process.exit(1);
		}
	}

}
