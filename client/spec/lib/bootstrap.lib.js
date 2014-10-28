'use strict';
require('./bootstrap.js');

console.log('\n Loading client/lib sources...' +
            '\n====================================');

var requireClient = global.requireClient;

exports.requireClient = requireClient;
module.exports = requireClient;

requireClient('lib/Grid');
requireClient('lib/Point');
requireClient('lib/Quadtree');
requireClient('lib/Rect');
requireClient('lib/SpatialHash');
requireClient('lib/Tiles');
