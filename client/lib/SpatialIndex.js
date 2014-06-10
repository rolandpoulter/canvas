'use strict';
var rbush = require('rbush');

module.exports = SpatialIndex;

function SpatialIndex(options) {
  options = options || {};
  this.rtree = rbush(options.maxEntries, options.entryFormat);
}

SpatialIndex.prototype.mixin = function (otherIndex) {
  if (!otherIndex) return;
  var currentEntries = this.all();
  var newEntries = otherIndex.all().filter(function (newEntry) {
    var index = currentEntries.indexOf(newEntry);
    if (index === -1) return;
    this.remove(newEntry);
    this.insert(newEntry);
    return true;
  }.bind(this));
  return this.load(newEntries);
};

SpatialIndex.prototype.remove = function (entry) {
  return this.rtree.remove(entry);
};

SpatialIndex.prototype.insert = function (entry) {
  return this.rtree.insert(entry);
};

SpatialIndex.prototype.all = function () {
  return this.rtree.all();
};

SpatialIndex.prototype.load = function (entryList) {
  return this.rtree.load(entryList);
};

SpatialIndex.prototype.search = function (queryBox) {
  return this.rtree.search(queryBox);
};

SpatialIndex.prototype.toJSON = function () {
  return this.rtree.toJSON();
};

SpatialIndex.prototype.fromJSON = function (json) {
  return this.rtree.fromJSON(json);
};
