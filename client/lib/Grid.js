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
  /*jshint maxstatements:18*/
  var Rect = global.Rect,
      rect = this.bounds,
      size = this.size,
      S = this.scale,
      xi = 0, xI = 0,
      yi = 0, yI = 0,
      sX = size.x,
      sY = size.y,
      xL = Math.abs(rect.getWidth() / sX),
      yL = Math.abs(rect.getHeight() / sY),
      oX = rect.left,
      oY = rect.top,
      grid = [],
      flat = [],
      row,
      cell,
      cX,
      cY;
  iterator = iterator || function (cell) {
    return cell;
  };
  for (; yi < yL; yi += S) {
    xi = xI = 0;
    row = grid[yI] = grid[yI] || [];
    for (; xi < xL; xi += S) {
      cX = oX + xi * sX;
      cY = oY + yi * sY;
      cell = new Rect(cX, cY, cX + sX, cY + sY);
      cell = row[xI] = iterator(cell, xi, yi, row, grid);
      flat.push(cell);
      xI += 1;
    }
    yI += 1;
  }
  grid.rows = grid.length;
  grid.cols = grid[0].length;
  grid.size = grid.rows * grid.cols;
  grid.flat = flat;
  return grid;
};
