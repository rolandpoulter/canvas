'use strict';

require('./Point.js');
require('./Rect.js');
require('./SpatialHash.js');

module.exports = global.Grid = Grid;

function Grid(viewRect, quadrantRect, size, scale) {
  this.bounds = viewRect;
  this.quadrant = quadrantRect;

  this.size = typeof size === 'number' ?
    new global.Point(size, size) :
    size;

  this.scale = scale || 1;
}

Grid.prototype.generate = function (iterator) {
  /*jshint maxstatements:18*/
  var Rect = global.Rect,
      quad = this.quadrant,
      view = this.bounds,
      size = this.size,
      S = this.scale,
      xi = 0, xI = 0,
      yi = 0, yI = 0,
      sX = size.x,
      sY = size.y,
      xO = quad.getWidth() % sX,
      yO = quad.getHeight() % sY,
      xL = Math.abs(view.getWidth() / sX),
      yL = Math.abs(view.getHeight() / sY),
      oX = 0, // view.left,
      oY = 0, // view.top,
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
      cX = xi * sX + oX - xO;
      cY = yi * sY + oY + yO;

      cell = new Rect(cX, cY, cX + sX, cY + sY);
      cell = row[xI] = iterator(cell, xi, yi, row, grid) || cell;

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
