// https://github.com/jrhdoty/generic-quadtree
'use strict';

module.exports = Box;
global.Point = Box;

var Point = require('./Point.js');

// generalized box class, defined by two points with
// lessThan (lte) and greaterThan (gte) functions
function Box(least, greatest) {
  this.low = least;
  this.high = greatest;
}

//return true if box contains point
Box.prototype.contains = function (point) {
  return (this.low.lte(point) && this.high.gte(point));
};

//return true if overlap of boxes
Box.prototype.overlaps = function (box) {
  //if this contains either point of box, then there is an overlap
  return (this.contains(box.low) || this.contains(box.high) ||
          box.contains(this.low) || box.contains(this.high));
};

//return array of children
Box.prototype.split = function () {
  return [
    new Box(
      this.low,
      new Point(
        (this.low.x + this.high.x) / 2,
        (this.low.y + this.high.y) / 2
      )
    ),
    new Box(
      new Point(
        (this.low.x + this.high.x) / 2,
        this.low.y
      ),
      new Point(
        this.high.x,
        (this.low.y + this.high.y) / 2
      )
    ),
    new Box(
      new Point(
        (this.low.x + this.high.x) / 2,
        (this.low.y + this.high.y) / 2
      ),
      this.high
    ),
    new Box(
      new Point(
        this.low.x,
        (this.low.y + this.high.y) / 2
      ),
      new Point(
        (this.low.x + this.high.x) / 2,
        this.high.y
      )
    )
  ];
};
