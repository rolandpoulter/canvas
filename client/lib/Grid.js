'use strict';

require('./Point.js');
require('./Rect.js');
require('./SpatialHash.js');

module.exports = global.Grid = Grid;

// Based on leaflet GridLayer

function Grid(manager, buffer) {
  this.manager = manager;
  this.buffer = buffer || 0.5;
}

Grid.prototype.scaleToDepth = function (scale) {
  var f = scale,
      d = 0;
  while (f <= 1) {
    f *= 2;
    d += 1;
  }
  return d - 1;
};

Grid.prototype.depthToScale = function (depth) {
  return Math.pow(0.5, depth);
};

Grid.prototype.increaseSize = function () {
  this.size.scale(2);
  this.depth += 1;
};

Grid.prototype.decreaseSize = function () {
  this.size.divide(2);
  this.depth -= 1;
};


Grid.prototype.keyOf = function (coords) {
  return coords.depth + ':' + coords.size + '|' + coords.x + ',' + coords.y;
};

Grid.prototype.checkCoords = function () {
  return true;
};

Grid.prototype.draw = function (worldBounds, size, scale, iterator) {
  /*jshint maxstatements:30, maxcomplexity:13*/
  this.viewBounds = worldBounds;
  this.size = typeof size === 'number' ? size : 256;
  this.scale = typeof scale === 'number' ? scale : 1;
  this.depth = this.scaleToDepth(this.scale);
  this.tileBounds = this.viewBounds.toTileSpace(this.size);

  this.current = this.current || [];
  this.queue = this.queue || [];
  this.cache = this.cache || {};

  iterator = (
    typeof size === 'function' ? size :
    typeof scale === 'function' ? scale :
  iterator) || function (cell) {
    return cell;
  };

  var coords = null,
      range = this.tileBounds,
      b = this.buffer + 1,
      y = Math.ceil(range.bottom - b), Y = Math.ceil(range.top   + b),
      x = Math.ceil(range.left   - b), X = Math.ceil(range.right + b),
      c = x;

  this.cols = X - x;
  this.rows = Y - y;

  for (; y < Y; y += 1) {
    x = c;
    for (; x < X; x += 1) {
      console.log('coords', x, y);
      coords = new global.Point(x, y);
      coords.depth = this.depth;
      coords.size = this.size;
      coords.key = this.keyOf(coords);
      // console.log('GOT HERE', coords);
      if (!this.cache[coords.key] && this.checkCoords(coords)) {
        this.queue.push(coords);
      }
    }
  }

  this.center = this.viewBounds.getCenter();
  this.queue.sort(function (a, b) {
    return a.distanceTo(this.center) - b.distanceTo(this.center);
  }.bind(this));

  if (this.queue.length === 0) return;

  this.current = this.current.filter(function (cell) {
    var intersects = cell.intersectsRect(this.viewBounds);
    console.log(intersects);
    // if (!intersects) {
    //   if (cell.release) cell.release();
    //   if (cell.ref && cell.ref.release) cell.ref.release();
    //   this.manager.remove(cell, true);
    //   return true;
    // }
  }.bind(this));

  this.queue = this.queue.filter(function (coords) {
    var cell;
    if (this.cache[coords.key]) {
      cell = this.cache[coords.key];
    }
    else {
      cell = coords.fromTileSpace(coords.size);
      // console.log('cell a', cell.x, cell.y);
      cell = cell.toScreenSpace();
      // console.log('cell b', cell.x, cell.y);
      // console.log(cell);
      cell = cell.toRectFromTopLeft(coords.size);
      // console.log('cell', cell);
      cell.col = coords.x;
      cell.row = coords.y;
      cell.key = coords.key;
      cell.size = coords.size;
      cell.depth = coords.depth;
    }
    console.log(coords.key);
    cell = iterator(cell) || cell;
    // console.log(cell);
    this.current.push(cell);
    return true;
  }.bind(this));

  this.length = this.current.length;

  console.log(this);

  return this.current;
};
