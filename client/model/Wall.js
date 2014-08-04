'use strict';
var SpatialIndex = require('../lib/SpatialIndex.js'),
    ModelStore = require('../lib/ModelStore.js');

var wallComponent = require('../ui/components/wall.jsx');

module.exports = Wall;

Wall.Store = new ModelStore();

function Wall(params) {
  this.currentView = null;
  this.setParams(params);
  this.setStruct(params);
  return Wall.Store.upsert(this);
}

Wall.prototype.setParams = function (params) {
  /*jshint maxstatements:15, maxcomplexity:5*/
  params = params || {};
  this.id = params.id;
  this.name = params.name;
  this.owner = params.owner;
  this.created = new Date(params.created);
  this.updated = new Date(params.updated);
  this.permissions = params.permissions;
  this.precision = params.precision;
  this.scale = params.scale;
};

Wall.prototype.setStruct = function (params) {
  /*jshint maxcomplexity:10*/
  if (this.index) this.index.mixin(params.index);
  else this.index = params.index || new SpatialIndex();
  if (this.views) this.views.mixin(params.views);
  else this.views = params.views || new ModelStore();
  if (this.boards) this.boards.mixin(params.boards);
  else this.boards = params.boards || new ModelStore();
};

Wall.prototype.render = function (parent) {
  console.log('render wall', this);
  this.component = wallComponent.render(parent || global.document.body, this);
  this.element = this.component.getDOMNode();
  this.renderCurrentView();
};

Wall.prototype.renderCurrentView = function () {
  if (!this.currentView) return;
  this.index.search(this.currentView.box).forEach(function (item) {
    item.model.render(this.element);
  }.bind(this));
};

Wall.prototype.setCurrentView = function (view) {
  /*jshint maxcomplexity:8*/
  if (this.currentView) {
    if (this.currentView === view) return;
    this.currentView.setCurrentWall(null);
  }
  if (view) {
    this.currentView = view;
    if (view.currentWall !== this) view.setCurrentWall(this);
  }
};

Wall.prototype.updateIndexedBox = function () {
  this.index.remove(this.box);
  this.index.insert(this.box);
};

Wall.prototype.upsertView = function (view) {
  this.views.insert(view);
  this.index.insert(view.box);
  if (this.element && this.currentView.intersects(view)) {
    view.render(this.element);
  }
};

Wall.prototype.removeView = function (view) {
  this.views.remove(view);
  this.index.remove(view);
};

Wall.prototype.upsertBoard = function (board) {
  this.boards.insert(board);
  this.index.insert(board.box);
  if (this.element && this.currentView.intersects(board)) {
    board.render(this.element);
  }
};

Wall.prototype.removeBoard = function (board) {
  this.boards.remove(board);
  this.index.remove(board);
};
