'use strict';
var BoundingBox = require('../lib/BoundingBox.js');

var viewComponent = require('../ui/components/view.jsx');

module.exports = View;

function View(params) {
  this.currentWall = null;
  this.setParams(params);
  this.setStruct(params);
}

View.prototype.setParams = function (params) {
  /*jshint maxstatements:15, maxcomplexity:5*/
  params = params || {};
  this.id = params.id;
  this.name = params.name;
  this.owner = params.owner;
  this.created = new Date(params.created);
  this.updated = new Date(params.updated);
  this.permissions = params.permissions;
  this.aspectRatio = Number(params.aspectRatio);
  this.offset = params.offset;
  this.scale = params.scale;
  this.parent = params.parent;
};

View.prototype.setStruct = function () {
  this.box = [0, 0, 0, 0];
  this.boundingBox = new BoundingBox(this);
  this.updateBox(true);
};

View.prototype.render = function (parent) {
  this.element = viewComponent.render(parent || global.document.body, this);
};

View.prototype.setCurrentWall = function (wall) {
  if (this.currentWall) {
    if (this.currentWall === wall) return;
    this.currentWall.setCurrentView(null);
  }
  if (wall) {
    if (wall.currentView !== this) {
      wall.setCurrentView(this);
    }
    this.currentWall = wall;
    this.render();
  }
};

View.prototype.updateBox = function (dontUpdateIndex) {
  this.boundingBox.updateBox(this.box);
  if (dontUpdateIndex) return;
  if (this.parent) this.parent.updateIndexedBox(this);
};

View.prototype.intersects = function (model) {
  return this.boundingBox.intersects(model.box);
};
