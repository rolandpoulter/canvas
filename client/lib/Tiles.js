'use strict';

require('./Rect.js');
require('./Quadtree.js');
require('./SpatialHash.js');

Number.MAX_CSS_VALUE = Number.MAX_CSS_VALUE || 33554400;

module.exports = global.Tiles = Tiles;

function Tiles(options) {/*jshint maxcomplexity:11*/
  options = options || {};
  // worldSize
  // collect
  // unique
  // scale
  // worldRect
  // level
  // maxObjects
  // maxDepth
  // powerOfTwo

  var s = options.worldSize ||
    (Number.MAX_CSS_VALUE * (options.scale || 0.001));

  this.world =
    options.worldRect ||
    new global.Rect(-s, s, s, -s);

  if (options.collect) this.collection = [];
  if (options.unique) this.unique = true;

  this.quadtree = new global.Quadtree(
    this.world,
    options.level || 0,
    options.maxObjects || 32,
    options.maxDepth || 256);

  this.spatialHash = new global.SpatialHash(
    options.powerOfTwo || 128);
}

Tiles.prototype.indexOf = function (rect, fromCollection) {
  if (this.collection && fromCollection) return this.collection.indexOf(rect);
  return [
    this.quadtree.getIndex(rect),
    this.spatialHash.getKeys(rect)
  ];
};

Tiles.prototype.insert = function (rect, ref) {
  if (ref) rect.setRef(ref);
  if (this.collection) {
    if (this.unique && this.indexOf(rect, true) !== -1) return;
    this.collection.push(rect);
  }
  this.quadtree.insert(rect);
  this.spatialHash.insert(rect);
};

Tiles.prototype.retreive = function (rect, fromCollection) {
  if (!rect) return this.collection;
  if (this.collection && fromCollection) {
    return this.collection[this.indexOf(rect, true)];
  }
  return [
    this.spatialHash.retreive(rect),
    this.quadtree.retreive(rect)
  ];
};

Tiles.prototype.clear = function () {
  this.collection.length = 0;
  this.quadtree.clear();
  this.spatialHash.clear();
};

Tiles.prototype.scaleToDepth = function (scale) {
  return 2 * scale;
};

Tiles.prototype.depthToScale = function (depth) {
  return 0.5 * depth;
};

Tiles.prototype.getNearestQuadtree = function (rect, scale) {
  scale = scale || 1;
  var node = this.quadtree,
      last,
      index;
  console.log(rect);
  while (true) {
    if (!node) return;
    if (rect.containsRect(node.rect)) return last;
    if (!node.nodes[0]) node.split();
    last = node;
    index = node.getIndex(rect);
    console.log(index);
    node = node.nodes[index];
    console.log('split');
  }
};

Tiles.prototype.fillView = function (viewRect, tileSize, scale, iterator) {
  scale = scale || 1;
  var nearestQuadtree = this.getNearestQuadtree(viewRect, scale);
  if (!nearestQuadtree) return [];
  var grid = new global.Grid(nearestQuadtree.rect, tileSize, scale);
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
