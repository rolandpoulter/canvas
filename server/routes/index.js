'use strict';
var path = require('path');

exports.create = function (app) {
	app.get('/', index);
	app.get('/:owner', index);
	app.get('/:owner/:wall', index);

	function index(request, response) {
		response.sendfile(
			path.join(__dirname, '..', '..', 'client', 'static', 'index.html')
		);
	}
};
