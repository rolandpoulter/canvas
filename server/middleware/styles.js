'use strict';

var path = require('path'),
    less = require('koa-less'),
    mount = require('koa-mount'),
    staticServer = require('koa-static');

var bs_path = path.join(__dirname, '..', '..', 'node_modules',
      'bootstrap'),
    bsw_path = path.join(__dirname, '..', '..', 'node_modules',
      'react-widgets');

var less_src = path.join(__dirname, '..', '..', 'client'),
    less_dest = path.join(__dirname, '..', '..', 'static');

app.base.use(mount('/fonts',
  staticServer(path.join(bs_path, 'fonts'))));

app.base.use(mount('/fonts',
  staticServer(path.join(bsw_path, 'dist', 'fonts'))));

app.base.use(less(less_src, {
  dest: less_dest,
  debug: true,
  force: true,
  once: false,
  pathRoot: '/',
  parser: {
    paths: [
      path.join(bs_path, 'less'),
      path.join(bsw_path, 'lib', 'less')
    ],
  }
}));
