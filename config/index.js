'use strict';
var nconf = require('nconf'),
    path = require('path');

nconf.argv().env();

var config_path = path.normalize(__dirname + '/default.json');

nconf.file(config_path);

exports.mongo = nconf.get('mongo');
exports.webserver = {
	cluster: nconf.get('webserver:cluster'),
	port: nconf.get('webserver:port'),
	host: nconf.get('webserver:host')
};
