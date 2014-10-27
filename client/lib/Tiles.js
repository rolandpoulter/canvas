'use strict';

require('./Rect.js');
require('./Quadtree.js');
require('./SpatialHash.js');

Number.MAX_CSS_VALUE = Number.MAX_CSS_VALUE || 33554400;

module.exports = global.Tiles = Tiles;

function Tiles(options) {
  options = options || {};

  var s = options.worldSize ||
    (Number.MAX_CSS_VALUE * (options.scale || 0.001));

  this.world =
    options.worldRect ||
    new global.Rect(-s, s, s, -s);

  this.quadtree = new global.Quadtree(
    this.world,
    options.level || 0,
    options.maxObjects || 32,
    options.maxDepth || 256);

  this.spatialHash = new global.SpatialHash(
    options.powerOfTwo || 128);

  this.tiles = [];
}

Tiles.prototype.getNearestQuadtree = function (rect, scale) {
  scale = scale || 1;
};

Tiles.prototype.fillView = function (viewRect, size, scale, iterator) {
  scale = scale || 1;
  var nearestQuadtree = this.getNearestQuadtree(viewRect, scale),
      grid = new global.Grid(nearestQuadtree.bounds, size, scale);
  return grid.generate(iterator);
};

Tiles.prototype.cullView = function (gridArray, viewRect, scale) {
  scale = scale || 1;
  var culled = [];
  gridArray.forEach(function (rowArray) {
    rowArray.forEach(function (cell) {
      if (cell.intersects(viewRect)) culled.push(cell);
    });
  });
  return culled;
};
