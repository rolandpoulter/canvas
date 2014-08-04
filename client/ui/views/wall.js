'use strict';
/*global app*/
var WallModel = require('../../model/Wall.js'),
    ViewModel = require('../../model/entity/View.js');
/*jshint unused:false*/
exports.before_filter = function (context, last_context) {
	console.log('before_filter');
	if (false) return true;
};

exports.before_render = function (context, last_context) {
	context.wallModel = new WallModel({
		id: 0,
		scale: 1
	});
	context.currentView = new ViewModel({
		id: -1,
		scale: 10,
		offset: [0, 0]
	});
	context.wallModel.setCurrentView(context.currentView);
	context.viewModels = [
		new ViewModel({
			id: 0,
			scale: 0.1,
			offset: [0, 0]
		}),
		new ViewModel({
			id: 1,
			scale: 0.2,
			offset: [1, 1]
		}),
		new ViewModel({
			id: 2,
			scale: 0.3,
			offset: [2, 2]
		}),
		new ViewModel({
			id: 3,
			scale: 0.4,
			offset: [3, 3]
		}),
		new ViewModel({
			id: 4,
			scale: 0.5,
			offset: [4, 4]
		}),
		new ViewModel({
			id: 5,
			scale: 0.6,
			offset: [5, 5]
		}),
		new ViewModel({
			id: 6,
			scale: 0.7,
			offset: [6, 6]
		}),
		new ViewModel({
			id: 7,
			scale: 0.8,
			offset: [7, 7]
		}),
		new ViewModel({
			id: 8,
			scale: 0.9,
			offset: [8, 8]
		}),
	];
	context.viewModels.forEach(
		context.wallModel.upsertView.bind(context.wallModel));
	global.context = context;
	console.log('before_render');
};

exports.after_render = function (context, last_context) {
	// app.ui.components.wall.render(app.$('div.page div.test').get(0));
	var testElem = app.$('div.page div.test').get(0);
  // debugger;
	context.wallModel.render(testElem);
	console.log('after_render');
};

exports.before_clear = function (context) {
	console.log('before_clear');
};

exports.after_clear = function (context) {
	console.log('after_clear');
};
