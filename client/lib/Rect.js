'use strict';

require('./Point.js');

module.exports = global.Rect = Rect;

function Rect(left, top, right, bottom) {
  this.left = left;
  this.top = top;
  this.right = right;
  this.bottom = bottom;
  this.ref = null;
}

Rect.prototype.setRef = function (object) {
  this.ref = object;
};

Rect.prototype.toScreenSpace = function (viewX, viewY, viewScale) {
  var a = new global.Point(this.left, this.top),
      b = new global.Point(this.right, this.bottom);
  a = a.toScreenSpace(viewX, viewY, viewScale);
  b = b.toScreenSpace(viewX, viewY, viewScale);
  return new Rect(a.x, -a.y, b.x, -b.y);
};

Rect.prototype.toWorldSpace = function (viewX, viewY, viewScale) {
  var a = new global.Point(this.left, this.top),
      b = new global.Point(this.right, this.bottom);
  a = a.toWorldSpace(viewX, viewY, viewScale);
  b = b.toWorldSpace(viewX, viewY, viewScale);
  return new Rect(a.x, -a.y, b.x, -b.y);
};

Rect.prototype.isSquare = function () {
  return this.getWidth() === this.getHeight();
};

Rect.prototype.getWidth = function () {
  return this.right - this.left;
};

Rect.prototype.getHeight = function () {
  return this.bottom - this.top;
};

Rect.prototype.getCenter = function () {
  var w = this.getWidth() / 2,
      h = this.getHeight() / 2;
  return new global.Point(this.left + w, this.top + h);
};

Rect.prototype.getSquareRoot = function () {
  return Math.sqrt(this.getWidth() * this.getHeight());
};

Rect.prototype.getLargestSide = function () {
  var w = this.getWidth(),
      h = this.getHeight();
  return w > h ? w : h;
};

Rect.prototype.getSmalledSide = function () {
  var w = this.getWidth(),
      h = this.getHeight();
  return w < h ? w : h;
};

Rect.prototype.getAspectRatio = function () {
  return this.getWidth() / this.getHeight();
};

Rect.prototype.intersectRect = function (rect) {
  return !(this.left   > rect.right  ||
           this.right  < rect.left   ||
           this.top    < rect.bottom ||
           this.bottom > rect.top);
};

Rect.prototype.containsPoint = function (point) {
  return point.x > this.left && point.x < this.right &&
         point.y > this.top && point.y < this.bottom;
};

Rect.prototype.containsRect = function (rect) {
  return this.left   < rect.left  &&
         this.right  > rect.right &&
         this.top    > rect.top   &&
         this.bottom < rect.bottom;
};

Rect.prototype.scale = function (x, y) {
  x = x || 1;
  y = y || x;
  this.left *= x;
  this.right *= x;
  this.top *= y;
  this.bottom *= y;
};

Rect.prototype.translate = function (x, y) {
  x = x || 0;
  y = y || 0;
  this.left += x;
  this.right += x;
  this.top += y;
  this.bottom += y;
};
