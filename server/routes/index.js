'use strict';
var sendIndex = require('./lib/sendIndex.js');

exports.create = function (app) {
	app.get('/', sendIndex);
};
