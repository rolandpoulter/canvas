'use strict';
// var nconf = require('nconf'),
//     path = require('path');
//
// nconf.argv().env();
//
// var config_path = path.normalize(__dirname + '/default.json');
//
// nconf.file(config_path);
//
// exports.mongo = nconf.get('mongo');
//
// exports.redis = nconf.get('redis');
// exports.redis.port = nconf.get('redis:port');
// exports.redis.host = nconf.get('redis:host');
//
// exports.webclient = nconf.get('webclient');
// exports.webclient.session_key = nconf.get('webclient:session_key');
//
// exports.webserver = nconf.get('webserver');
// exports.webserver.cluster = nconf.get('webserver:cluster');
// exports.webserver.port = nconf.get('webserver:port');
// exports.webserver.host = nconf.get('webserver:host');

exports.client = {};

exports.server = {
  host: 'localhost',
  port: 3000
};
