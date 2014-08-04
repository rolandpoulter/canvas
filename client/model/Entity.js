'use strict';
/*global app*/
module.exports = Entity;

function Entity(params) {
  this.setParams(params);
  this.setStruct(params);
}

Entity.prototype.setParams = function (params) {
  /*jshint maxstatements:15, maxcomplexity:5*/
  params = params || {};
  this.id = params.id;
  this.wall = params.wall;
  this.name = params.name;
  this.type = params.type;
  this.meta = params.meta;
  this.body = params.body;
  this.owner = params.owner;
  this.layer = parseInt(params.layer, 10);
  this.created = new Date(params.created);
  this.updated = new Date(params.updated);
  this.permissions = params.permissions;
  this.offset = params.offset;
  this.scale = params.scale;
  this.parent = params.parent;
};

Entity.prototype.setStruct = function (params) {
  var SubModel = app.model.entity[this.type];
  if (SubModel) {
    this.sub_model = new SubModel(params, this);
  }
  else {
    console.warn('Missing entity type constructor: ', this.type);
  }
};
