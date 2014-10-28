'use strict';/*global window*/

require('./Rect.js');

module.exports = global.Point = Point;

function Point(x, y, z, s) {
  this.x = x || 0; // x-axis coordinate
  this.y = y || 0; // y-axis coordinate
  this.z = z || 0; // layer depth
  this.s = s || 0; // size scale
}

Point.prototype.toScreenSpace = function (viewX, viewY, viewScale) {
  viewScale = viewScale || 1;
  var w = window.innerWidth,
      h = window.innerHeight,
      W = w / 2 + viewX,
      H = h / 2 + viewY;
  return new Point(
    (this.x * viewScale) + W,
    (this.y * viewScale) + H);
};

Point.prototype.toWorldSpace = function (viewX, viewY, viewScale) {
  viewScale = viewScale || 1;
  var w = window.innerWidth,
      h = window.innerHeight,
      W = w / 2 - viewX,
      H = h / 2 - viewY;
  return new Point(
    (this.x / viewScale) - W,
    (this.y / viewScale) - H);
};

Point.prototype.toRectFromCenter = function (width, height) {
  width = width || 1;
  height = height || width;
  var w = width / 2,
      h = height / 2;
  return new global.Rect(
    this.x - w,
    this.y - h,
    this.x + w,
    this.y + h);
};

Point.prototype.toRectFromTopLeft = function (width, height) {
  width = width || 1;
  height = height || width;
  return new global.Rect(
    this.x,
    this.y,
    this.x + width,
    this.y + height);
};

Point.prototype.toRectFromBottomRight = function (width, height) {
  width = width || 1;
  height = height || width;
  return new global.Rect(
    this.x - width,
    this.y - height,
    this.x,
    this.y);
};

Point.prototype.translate = function (x, y) {
  if (y === undefined) y = x;
  this.x += x;
  this.y += y;
};
