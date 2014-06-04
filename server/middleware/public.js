var path = require('path'),
    serveStatic = require('serve-static');

exports.create = function (app) {
	process.nextTick(function () {
		app.use(serveStatic(path.join(__dirname, '..', '..', 'client', 'public')));
	});
};
