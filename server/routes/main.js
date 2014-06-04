var path = require('path');

exports.create = function (app) {
	app.get('*', send_index)
	// app.get('/:owner', send_index);
	// app.get('/:owner/:wall', send_index);

	function send_index (request, response) {
		response.sendfile(
			path.join(__dirname, '..', '..', 'client', 'public', 'index.html')
		);
	}
};
