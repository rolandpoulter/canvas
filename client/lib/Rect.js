'use strict';

require('./Point.js');

module.exports = global.Rect = Rect;

Rect.cache = {};

function Rect(left, top, right, bottom, ref) {
  this.left = left;
  this.top = top;
  this.right = right;
  this.bottom = bottom;
  this.ref = ref || null;
}

Rect.fromCache = function (hash) {
  return Rect.cache[hash];
};

Rect.prototype.cache = function () {
  var hash = [this.left, this.top, this.right, this.bottom].join(':'),
      existing = Rect.fromCache(hash);

  if (existing) return existing;

  this.hash = hash;
  Rect.cache[hash] = this;

  return this;
};

Rect.prototype.release = function () {
  if (this.hash) {
    delete Rect.cache[this.hash];
  }
};

Rect.prototype.setRef = function (object) {
  this.ref = object;
};

Rect.prototype.toScreenSpace = function (viewX, viewY, viewScale) {
  var a = new global.Point(this.left, this.top),
      b = new global.Point(this.right, this.bottom);

  a = a.toScreenSpace(viewX, viewY, viewScale);
  b = b.toScreenSpace(viewX, viewY, viewScale);

  return new Rect(a.x, a.y, b.x, b.y);
};

Rect.prototype.toWorldSpace = function (viewX, viewY, viewScale) {
  var a = new global.Point(this.left, this.top),
      b = new global.Point(this.right, this.bottom);

  a = a.toWorldSpace(viewX, viewY, viewScale);
  b = b.toWorldSpace(viewX, viewY, viewScale);

  return new Rect(a.x, a.y, b.x, b.y);
};

Rect.prototype.toTileSpace = function (tileSize) {
  var a = new global.Point(this.left, this.top),
      b = new global.Point(this.right, this.bottom);

  a = a.toTileSpace(tileSize);
  b = b.toTileSpace(tileSize);

  return new Rect(a.x, a.y, b.x, b.y);
};

Rect.prototype.fromTileSpace = function (tileSize) {
  var a = new global.Point(this.left, this.top),
      b = new global.Point(this.right, this.bottom);

  a = a.fromTileSpace(tileSize);
  b = b.fromTileSpace(tileSize);

  return new Rect(a.x, a.y, b.x, b.y);
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

Rect.prototype.intersectsRect = function (rect) {
  return !(this.left   > rect.right  ||
           this.right  < rect.left   ||
           this.top    < rect.bottom ||
           this.bottom > rect.top);
};

Rect.prototype.intersectRect2 = function (rect) {
  var x = 2 * Math.abs(this.left - rect.left),
      y = 2 * Math.abs(this.top  - rect.top),
      w = this.getWidth() + rect.getWidth(),
      h = this.getHeight() + rect.getHeight();

  return x < w && y < h;
};

Rect.prototype.containsPoint = function (point) {
  return point.x > this.left && point.x < this.right &&
         point.y > this.top  && point.y < this.bottom;
};

Rect.prototype.containsRect = function (rect) {
  return this.left   < rect.left  &&
         this.right  > rect.right &&
         this.top    > rect.top   &&
         this.bottom < rect.bottom;
};

Rect.prototype.floor = function () {
  return new Rect(
    Math.floor(this.left),
    Math.floor(this.top),
    Math.floor(this.right),
    Math.floor(this.bottom),
    this.ref);
};

Rect.prototype.ceil = function () {
  return new Rect(
    Math.ceil(this.left),
    Math.ceil(this.top),
    Math.ceil(this.right),
    Math.ceil(this.bottom),
    this.ref);
};

Rect.prototype.round = function () {
  return new Rect(
    Math.round(this.left),
    Math.round(this.top),
    Math.round(this.right),
    Math.round(this.bottom),
    this.ref);
};

Rect.prototype.abs = function () {
  return new Rect(
    Math.abs(this.left),
    Math.abs(this.top),
    Math.abs(this.right),
    Math.abs(this.bottom),
    this.ref);
};

Rect.prototype.sqrt = function () {
  return new Rect(
    Math.sqrt(this.left),
    Math.sqrt(this.top),
    Math.sqrt(this.right),
    Math.sqrt(this.bottom),
    this.ref);
};

Rect.prototype.copy = function () {
  return new Rect(
    Math.sqrt(this.left),
    Math.sqrt(this.top),
    Math.sqrt(this.right),
    Math.sqrt(this.bottom),
    this.ref);
};

Rect.prototype.translate = function (x, y) {
  x = x || 0;
  if (y === undefined) y = x;
  this.left += x;
  this.right += x;
  this.top += y;
  this.bottom += y;
  return this;
};

Rect.prototype.add = Rect.prototype.translate;

Rect.prototype.subtract = function (x, y) {
  x = x || 0;
  if (y === undefined) y = x;
  this.left -= x;
  this.right -= x;
  this.top -= y;
  this.bottom -= y;
  return this;
};

Rect.prototype.scale = function (x, y) {
  x = x || 1;
  if (y === undefined) y = x;
  this.left *= x;
  this.right *= x;
  this.top *= y;
  this.bottom *= y;
  return this;
};

Rect.prototype.multiply = Rect.prototype.scale;

Rect.prototype.divide = function (x, y) {
  x = x || 1;
  if (y === undefined) y = x;
  this.left /= x;
  this.right /= x;
  this.top /= y;
  this.bottom /= y;
  return this;
};

Rect.prototype.modulus = function (x, y) {
  x = x || 1;
  if (y === undefined) y = x;
  this.left %= x;
  this.right %= x;
  this.top %= y;
  this.bottom %= y;
  return this;
};
