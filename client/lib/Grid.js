'use strict';

require('./Point.js');
require('./SpatialHash.js');

module.exports = global.Grid = Grid;

function Grid(rect, size, scale) {
  this.bounds = rect;
  this.size = typeof size === 'number' ?
    new global.Point(size, size) :
    size;
  this.scale = scale || 1;
}

Grid.prototype.generate = function (iterator) {
  var Rect = global.Rect,
      rect = this.bounds,
      size = this.size,
      S = this.scale,
      xi = 0,
      yi = 0,
      sX = size.x,
      sY = size.y,
      xL = rect.getWidth() / sX,
      yL = rect.getHeight() / sY,
      oX = rect.left,
      oY = rect.top,
      grid = [],
      row,
      cell,
      cX,
      cY;
  iterator = iterator || function (cell) {
    return cell;
  };
  for (; xi < xL; xi += S) {
    row = grid[xi] = [];
    for (; yi < yL; yi += S) {
      cX = oX + xi * sX;
      cY = oY + yi * sY;
      cell = new Rect(cX, cY, cX + sX, cY + sY);
      row[yi] = iterator(cell, xi, yi, row, grid);
    }
  }
  return grid;
};
