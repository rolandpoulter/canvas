'use strict';
/*global app*/

var canvas_window = app.ui.components.canvas_window;

/*jshint unused:false*/
exports.before_filter = function (context, last_context) {
	console.log('before_filter');
};

exports.before_render = function (context, last_context) {
	console.log('before_render');
};

exports.after_render = function (context, last_context) {
	var testElem = app.$('div.page div.test').get(0);
	// context.canvasWindow = new canvas_window.render(testElem);
	console.log('after_render');
};

exports.before_clear = function (context) {
	console.log('before_clear');
};

exports.after_clear = function (context) {
	console.log('after_clear');
};
