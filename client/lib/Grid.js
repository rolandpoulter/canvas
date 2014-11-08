'use strict';

require('./Point.js');
require('./Rect.js');
require('./SpatialHash.js');

module.exports = global.Grid = Grid;

// Based on leaflet GridLayer

function Grid(manager, buffer) {
  this.manager = manager;
  this.buffer = buffer || 0.5;
  this.clear();
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

Grid.prototype.clear = function () {
  if (this.current) {
    this.current.forEach(function (cell) {
      if (cell.release) cell.release();
      if (cell.ref && cell.ref.release) cell.ref.release();
      this.manager.remove(cell, true);
    }.bind(this));
  }

  this.current = [];
  this.queue = [];
  this.cache = {};
  this.length = 0;
  this.cols = 0;
  this.rows = 0;
};

Grid.prototype.setViewBounds = function (worldBounds, size, scale) {
  /*jshint maxstatements:15*/
  var update = false;

  if (typeof worldBounds === 'object') {
    this.viewBounds = worldBounds;
    update = true;
  }

  if (typeof size === 'number') {
    this.size = size;
    update = true;
  }

  if (typeof scale === 'number') {
    this.scale = scale;
    update = true;
  }

  if (update) {
    this.depth = this.scaleToDepth(this.scale);
    this.tileBounds = this.viewBounds.toTileSpace(this.size);
  }

  return this;
};

Grid.prototype.draw = function (iterator) {
  /*jshint maxstatements:20, maxcomplexity:10*/
  iterator = iterator || function (cell) {
    return cell;
  };

  var coords = null,
      range = this.tileBounds,
      b = this.buffer + 0.5,
      y = Math.ceil(range.bottom - b), Y = Math.ceil(range.top   + b),
      x = Math.ceil(range.left   - b), X = Math.ceil(range.right + b),
      c = x;

  this.cols = X - x;
  this.rows = Y - y;

  // console.log('x range', x, X);
  // console.log('y range', y, Y);

  for (; y < Y; y += 1) {
    x = c;
    for (; x < X; x += 1) {
      coords = new global.Point(x, y);
      coords.depth = this.depth;
      coords.size = this.size;
      coords.key = this.keyOf(coords);
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

  this.queue = this.queue.filter(function (coords) {
    var cell, action;

    // console.log(coords.key);
    if (this.cache[coords.key]) {
      // console.log('update tile');
      cell = this.cache[coords.key];
      action = 'update';
    }

    else {
      // console.log('new tile');
      action = 'new';
      cell = coords.fromTileSpace(coords.size);
      cell = cell.toScreenSpace();
      cell = cell.toRectFromTopLeft(coords.size);
      cell.col = coords.x;
      cell.row = coords.y;
      cell.key = coords.key;
      cell.size = coords.size;
      cell.depth = coords.depth;
    }

    cell = iterator(cell, action) || cell;
    this.cache[coords.key] = cell;

    this.current.push(cell);

    return true;
  }.bind(this));

  // this.cull();

  this.length = this.current.length;

  return this.current;
};

Grid.prototype.cull = function (worldBounds) {
  this.setViewBounds(worldBounds);

  this.current = this.current.filter(function (cell) {
    var intersects = cell.intersectsRect(this.viewBounds);
    if (!intersects) {
      if (cell.release) cell.release();
      if (cell.ref && cell.ref.release) cell.ref.release();
      this.manager.remove(cell, true);
      return true;
    }
  }.bind(this));

  return this.current;
};
