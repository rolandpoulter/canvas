exports.io = function (ws, model, config) {
	var view = ws.ch.registerChannel('view');

	view.on('connection', function (view) {

	});

	// session.on('c_views', function (q) {
	// 	model.View.create(q);
	// });

	// session.on('r_views', function (q) {
	// 	model.View.find(q);
	// });

	// session.on('u_views', function (q) {
	// 	model.View.update(q);
	// });

	// session.on('d_views', function (q) {
	// 	model.View.destroy(q);
	// });
};
