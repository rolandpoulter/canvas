'use strict';/*global window*/

require('./Rect.js');

module.exports = global.Point = Point;

function Point(x, y) {
  this.x = x || 0; // x-axis coordinate
  this.y = y || 0; // y-axis coordinate
}

// http://stackoverflow.com/questions/14880601/translating-between-cartesian-and-screen-coordinates

Point.prototype.toScreenSpace = function (viewScale) {
  viewScale = viewScale || 1;

  var screenWidth  = window.innerWidth,
      screenHeight = window.innerHeight,
      screenX =  (this.x + screenWidth  / 2) / viewScale,
      screenY = (-this.y + screenHeight / 2) / viewScale;

  return new Point(screenX, screenY);
};

Point.prototype.toWorldSpace = function (viewScale) {
  viewScale = viewScale || 1;

  var screenWidth  = window.innerWidth,
      screenHeight = window.innerHeight,
      cartesianX =  viewScale * this.x - screenWidth  / 2,
      cartesianY = -viewScale * this.y + screenHeight / 2;

  return new Point(cartesianX, cartesianY);
};

Point.prototype.toScreenRect = function (viewScale, width, height) {
  viewScale = viewScale || 1;

  width =  (width  || window.innerWidth)  * viewScale;
  height = (height || window.innerHeight) * viewScale;

  var x = this.x * viewScale,
      y = this.y * viewScale;

  return new global.Rect(
    x,         y,
    x + width, y + height);
};

Point.prototype.toRectFromCenter = function (width, height) {
  width = width || 1;
  height = height || width;

  var w = width / 2,
      h = height / 2;

  return new global.Rect(
    this.x - w, this.y + h,
    this.x + w, this.y - h);
};

Point.prototype.toRectFromTopLeft = function (width, height) {
  width = width || 1;
  height = height || width;

  return new global.Rect(
    this.x,         this.y,
    this.x + width, this.y - height);
};

Point.prototype.toRectFromBottomRight = function (width, height) {
  width = width || 1;
  height = height || width;

  return new global.Rect(
    this.x - width, this.y + height,
    this.x,         this.y);
};

Point.prototype.translate = function (x, y) {
  x = x || 0;
  if (y === undefined) y = x;

  this.x += x;
  this.y += y;
};

// var a = new Point(0, 0).toRectFromCenter(10, 10),
//     b = new Point(0, 0).toRectFromCenter(5, 5),
//     c = new Point(0, 0).toRectFromTopLeft(5, 5),
//     d = new Point(0, 0).toRectFromBottomRight(5, 5);
//
// console.log('ab', a.intersectsRect(b));
// console.log('ac', a.intersectsRect(c));
// console.log('ad', a.intersectsRect(d));
// console.log('bd', b.intersectsRect(d));
