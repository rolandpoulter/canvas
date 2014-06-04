'use strict';
var path = require('path'),
    less = require('less-middleware'),
    express = require('express');

exports.create = function (app) {
	var bs_path = path.join(__dirname, '..', '..', 'node_modules', 'bootstrap'),
	    less_src = path.join(__dirname, '..', '..', 'client', 'ui', 'less'),
	    less_dest = path.join(__dirname, '..', '..', 'client', 'public');

	app.use('/img', express.static(path.join(bs_path, 'img')));
	app.use(less(less_src, {dest: less_dest}, {
		paths: [path.join(bs_path, 'less')],
	}));
};
