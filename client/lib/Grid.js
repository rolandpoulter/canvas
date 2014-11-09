'use strict';

require('./Point.js');
require('./Rect.js');
require('./SpatialHash.js');

module.exports = global.Grid = Grid;

// Based on leaflet GridLayer

function Grid(manager) {
  this.manager = manager;

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
  /*jshint maxstatements:35, maxcomplexity:12*/
  iterator = iterator || function (cell) {
    return cell;
  };

  var coords = null,
      range = this.tileBounds,
      x = range.left,   X = range.right,
      y = range.bottom, Y = range.top,
      r = x;

  if (x > X) { x = range.right; X = range.left; }
  if (y > Y) { y = range.top;   Y = range.bottom; }

  x = Math.abs(x) === x ? Math.ceil(x) :  Math.floor(x);
  X = Math.abs(X) === X ? Math.ceil(X) :  Math.floor(X);

  y = Math.abs(y) === y ? Math.ceil(y) :  Math.floor(y);
  Y = Math.abs(Y) === Y ? Math.ceil(Y) :  Math.floor(Y);

  r = x;

  // offset hacks
  x -= 1;
  X += 1;
  // y += 1;
  // Y += 1;
  Y += 2;

  this.cols = X - x;
  this.rows = Y - y;

  for (; y < Y; y += 1) {
    x = r;
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

    if (this.cache[coords.key]) {
      action = 'update';
      cell = this.cache[coords.key];
    }

    else {
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

    if (action === 'new') {
      this.cache[coords.key] = cell;
      this.current.push(cell);
    }

    return true;
  }.bind(this));

  // this.cull();

  this.length = this.current.length;

  return this.current;
};

Grid.prototype.cull = function (viewBounds) {
  this.setViewBounds(viewBounds);

  viewBounds = this.viewBounds.toScreenSpace();

  this.current = this.current.filter(function (cell) {
    var intersects = viewBounds.intersectsRect(cell);
    if (!intersects) {
      if (cell.release) cell.release();
      if (cell.ref && cell.ref.release) cell.ref.release();
      this.manager.remove(cell, true);
      return true;
    }
  }.bind(this));

  return this.current;
};
