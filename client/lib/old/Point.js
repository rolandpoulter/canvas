// https://github.com/jrhdoty/generic-quadtree
'use strict';

module.exports = Point;
global.Point = Point;

//two dimensional point
function Point(x, y) {
  this.x = x;
  this.y = y;
}

//less than or equal to in both dimensions
Point.prototype.lte = function (point) {
  return (this.x <= point.x && this.y <= point.y);
};

//greater than or equal to in both dimensions
Point.prototype.gte = function (point) {
  return (this.x >= point.x && this.y >= point.y);
};

//return true if points are equal in both dimensions
Point.prototype.equals = function (point) {
  return (this.x === point.x  && this.y === point.y);
};
