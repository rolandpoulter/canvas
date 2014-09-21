'use strict';

var path = require('path'),
    less = require('koa-less'),
    mount = require('koa-mount'),
    staticServer = require('koa-static');

var bs_path = path.join(__dirname, '..', '..', 'node_modules', 'bootstrap'),
    less_src = path.join(__dirname, '..', '..', 'client'),
    less_dest = path.join(__dirname, '..', '..', 'static', 'css');

app.use(mount('/fonts', staticServer(path.join(bs_path, 'fonts'))));

app.use(less(less_src, {dest: less_dest}, {
	paths: [path.join(bs_path, 'less')],
}));
