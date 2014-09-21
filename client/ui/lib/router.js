'use strict';
/*global jQuery, document, events*/
var qs = require('querystring');

var layouts = global.app.ui.layouts,
    partials = global.app.ui.partials;

console.log(partials);

module.exports = function (route, block) {
	if (block) block(route);
	return router.bind(route);
};

var last_context;

function router(context) {
	/*jshint validthis:true */
	context.route = this;
	context.scope = context.scope || {};
	context.scope.params = qs.parse(context.querystring);
	if (this.before_filter && this.before_filter(context, last_context)) {
		return;
	}
	render(context);
	last_context = context;
}

function render(context) {
	/*jshint maxcomplexity:5*/
	if (last_context) clear(last_context);
	if (context.route.before_render) {
		context.route.before_render(context, last_context);
	}
  var view = context.route.view || layouts.main;
  var html = view.render(context.scope, partials);
	context.view = jQuery(html);
	context.view.appendTo(document.body);
	if (context.route.after_render) {
		context.route.after_render(context, last_context);
	}
}

function clear(context) {
	/*jshint maxcomplexity:5*/
	if (context.route.before_clear) {
		context.route.before_render(context);
	}
	if (context.route.clear === false) return;
	if (context.route.clear === 'page') {
		jQuery(document.body).empty();
		events.emit('clear_page', context);
	}
	else {
		context.view.remove().empty();
		events.emit('clear_view', context);
	}
	if (context.route.after_render) {
		context.route.after_render(context);
	}
}
