'use strict';
module.exports = ModelStore;

function ModelStore(options) {
  options = options || {};
  this.models = [];
  this.index = {};
}

ModelStore.prototype.mixin = function (otherStore) {
  if (!otherStore) return;
  var newEntries = otherStore.models.filter(function (newEntry) {
    return this.select(newEntry);
  }.bind(this));
  this.load(newEntries);
};

ModelStore.prototype.select = function (model) {
  return this.index[model.id];
};

ModelStore.prototype.upsert = function (model) {
  var existing = this.select(model);
  if (existing) {
    if (existing.setParams) existing.setParams(model);
    if (existing.setStruct) existing.setStruct(model);
    return existing;
  }
  this.insert(model);
  return model;
};

ModelStore.prototype.insert = function (model) {
  this.models.push(model);
  this.index[model.id] = model;
};

ModelStore.prototype.remove = function (model) {
  if (!this.select(model)) return;
  var index = this.models.indexOf(model);
  this.models.splice(index, 1);
  delete this.index[model.id];
};

ModelStore.prototype.load = function (entryList) {
  entryList.forEach(this.insert.bind(this));
};
