'use strict';
exports.before_filter = function (context, last_context) {
	console.log('before_filter');
	// return true; // to filter
};

exports.before_render = function (context, last_context) {
	console.log('before_render');
};

exports.after_render = function (context, last_context) {
	console.log('after_render');
};

exports.before_clear = function (context) {
	console.log('before_clear');
};

exports.after_clear = function (context) {
	console.log('after_clear');
};
