'use strict';
/*global app*/
/*jshint unused:false*/
exports.before_filter = function (context, last_context) {
	console.log('before_filter');
	if (false) return true;
};

exports.before_render = function (context, last_context) {
	console.log('before_render');
};

exports.after_render = function (context, last_context) {
	app.ui.components.main.render(app.$('div.page div.test').get(0));
	console.log('after_render');
};

exports.before_clear = function (context) {
	console.log('before_clear');
};

exports.after_clear = function (context) {
	console.log('after_clear');
};
