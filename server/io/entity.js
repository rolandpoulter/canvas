exports.io = function (ws, model, config) {
	var entity = ws.ch.registerChannel('entity');

	entity.on('connection', function (entity) {
		entity.on('data', function (data) {});
	});

	// session.on('c_entities', function (q) {
	// 	model.View.create(q);
	// });

	// session.on('r_entities', function (q) {
	// 	model.View.find(q);
	// });

	// session.on('u_entities', function (q) {
	// 	model.View.update(q);
	// });

	// session.on('d_entities', function (q) {
	// 	model.View.destroy(q);
	// });
};
