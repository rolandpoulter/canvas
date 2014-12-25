'use strict';/*global window*/

require('./Rect.js');

module.exports = global.Point = Point;

function Point(x, y) {
  this.x = x || 0; // x-axis coordinate
  this.y = y || 0; // y-axis coordinate
}

// http://stackoverflow.com/questions/14880601/translating-between-cartesian-and-screen-coordinates

Point.prototype.toGeoJSON = function () {
  return {type: 'Point', coordinates: [this.x, this.y]};
};

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

Point.prototype.toTileSpace = function (tileSize) {
  return new Point(
    this.x / tileSize,
    this.y / tileSize);
};

Point.prototype.fromTileSpace = function (tileSize) {
  return new Point(
    this.x * tileSize,
    this.y * tileSize);
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

Point.prototype.distanceTo = function (point) {
  var x = point.x - this.x,
      y = point.y - this.y;
  return Math.sqrt(x * x + y * y);
};

Point.prototype.floor = function () {
  return new Point(Math.floor(this.x), Math.floor(this.y));
};

Point.prototype.ceil = function () {
  return new Point(Math.ceil(this.x), Math.ceil(this.y));
};

Point.prototype.round = function () {
  return new Point(Math.round(this.x), Math.round(this.y));
};

Point.prototype.abs = function () {
  return new Point(Math.abs(this.x), Math.abs(this.y));
};

Point.prototype.sqrt = function () {
  return new Point(Math.sqrt(this.x), Math.sqrt(this.y));
};

Point.prototype.copy = function () {
  return new Point(this.x, this.y);
};

Point.prototype.translate = function (x, y) {
  x = x || 0;
  if (y === undefined) y = x;
  this.x += x;
  this.y += y;
  return this;
};

Point.prototype.add = Point.prototype.translate;

Point.prototype.subtract = function (x, y) {
  x = x || 0;
  if (y === undefined) y = x;
  this.x -= x;
  this.y -= y;
  return this;
};

Point.prototype.scale = function (x, y) {
  x = x || 1;
  if (y === undefined) y = x;
  this.x *= x;
  this.y *= y;
  return this;
};

Point.prototype.multiply = Point.prototype.scale;

Point.prototype.divide = function (x, y) {
  x = x || 1;
  if (y === undefined) y = x;
  this.x /= x;
  this.y /= y;
  return this;
};

Point.prototype.modulus = function (x, y) {
  x = x || 1;
  if (y === undefined) y = x;
  this.x %= x;
  this.y %= y;
  return this;
};
