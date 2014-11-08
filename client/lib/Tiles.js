'use strict';

require('./Grid.js');
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

  this.grid = new global.Grid(this);
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

Tiles.prototype.remove = function (rect, fromCollection) {
  var index;

  if (this.collection && fromCollection) {
    while ((index = this.collection.indexOf(rect)) !== -1) {
      this.collection.splice(index, 1);
    }
  }

  this.quadtree.remove(rect);
  this.spatialHash.remove(rect);
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
  if (this.collection) this.collection.length = 0;

  this.quadtree.clear();
  this.spatialHash.clear();

  this.grid.clear();
};

Tiles.prototype.setViewBounds = function (worldBounds, size, scale) {
  this.grid.setViewBounds(worldBounds, size, scale);
};

Tiles.prototype.reset = function (viewRect, tileSize, scale, iterator) {
  // console.log('reset tiles');
  this.clear();

  return this.update(viewRect, tileSize, scale, iterator);
};

Tiles.prototype.update = function (viewRect, tileSize, scale, iterator) {
  return this.grid.draw(viewRect, tileSize, scale, function (cell, action) {
    if (iterator) cell = iterator(cell, action) || cell;

    if (action === 'new') this.insert(cell);

    return cell;
  }.bind(this));
};

// Tiles.prototype.cull = function (viewRect) {
  // TODO:
// };
