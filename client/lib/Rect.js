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
  return !(rect.left > this.right ||
           rect.right < this.left ||
           rect.top > this.bottom ||
           rect.bottom < this.top);
};

Rect.prototype.containsPoint = function (point) {
  return point.x > this.left && point.x < this.right &&
         point.y > this.top && point.y < this.bottom;
};

Rect.prototype.containsRect = function (rect) {
  /*jshint bitwise:false, maxstatements:20, maxcomplexity:25*/
  var w = this.getWidth(),
      h = this.getHeight(),
      W = this.getWidth(),
      H = this.getHeight();

  // At least one of the dimensions is negative...
  if ((w | h | W | H) < 0) return false;

  // Note: if any dimension is zero, tests below must return false...
  var x = this.left,
      y = this.top,
      X = rect.left,
      Y = rect.top;

  if (X < x || Y < y) return false;

  w += x;
  W += X;

  if (W <= X) {
    // X+W overflowed or W was zero, return false if...
    // either original w or W was zero or
    // x+w did not overflow or
    // the overflowed x+w is smaller than the overflowed X+W
    if (w >= x || W > w) return false;
  }

  else {
    // X+W did not overflow and W was not zero, return false if...
    // original w was zero or
    // x+w did not overflow and x+w is smaller than X+W
    if (w >= x && W > w) return false;
  }

  h += y;
  H += Y;

  if (H <= Y) {
    if (h >= y || H > h) return false;
  }

  else {
    if (h >= y && H > h) return false;
  }

  return true;
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
