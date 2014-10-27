// https://github.com/jrhdoty/generic-quadtree
'use strict';

module.exports = Quadtree;
global.Quadtree = Quadtree;

require('./Box');

function Quadtree(box, max) {
  this.box = box;
  this.children = null;
  this.value = [];
  this.max = max || 10; //max points per node
}

Quadtree.prototype.insert = function (point, object) {
  /*jshint maxstatements:20*/
  //check if should contain point
  if (!this.box.contains(point)) {
    return this;
  }

  //if is a leaf node and not full, then insert
  //need to check if it already exists though
  var i;
  if (this.children === null && this.value.length < this.max) {
    for (i = 0; i < this.value.length; i++) {
      if (this.value[i].point.equals(point)) {
        this.value[i].value = object;
        return;
      }
    }
    this.value.push({point: point, value: object});
    return this;
  }

  //if is a leaf node but full, call subdivide
  if (this.children === null) {
    this.subdivide();
  }

  // if is not a leaf node, call insert on child nodes
  for (i = 0; i < this.children.length; i++) {
    this.children[i].insert(point, object);
  }
  this.value = [];
  return this;
};

Quadtree.prototype.subdivide = function () {
  //use box quadrant method to create 4 new equal child quadrants
  this.children = this.box.split();
  for (var i = 0; i < this.children.length; i++) {
    this.children[i] = new Quadtree(this.children[i], this.max);
  }
  //try inserting each value into the new child nodes
  for (i = 0; i < this.value.length; i++) {
    for (var k = 0; k < this.children.length; k++) {
      this.children[k].insert(this.value[i].point, this.value[i].value);
    }
  }
};

Quadtree.prototype.queryRange = function (box) {
  //return all point/value pairs contained in range
  var result = [];
  this._queryRangeRec(box, result);
  return result;
};

Quadtree.prototype._queryRangeRec = function (box, result) {
  /*jshint maxstatements:20*/
  //if query area doesn't overlap this box then return
  if (!this.box.overlaps(box)) {
    return;
  }
  //if leaf node with contained value(s), then check against contained objects
  var i;
  if (this.value.length > 0) {
    for (i = 0; i < this.value.length; i++) {
      if (box.contains(this.value[i].point)) {
        result.push(this.value[i]);
      }
    }
    return;
  }
  //if has children, then make recursive call on children
  if (this.children !== null) {
    for (i = 0; i < this.children.length; i++) {
      this.children[i]._queryRangeRec(box, result);
    }
    return;
  }
};

Quadtree.prototype.queryPoint = function (point) {
  /*jshint maxstatements:20*/
  //return value if tree contains point
  if (!this.box.contains(point)) {
    return null;
  }

  if (this.value.length > 0) {
    for (var i = 0; i < this.value.length; i++) {
      if (this.value[i].point.equals(point)) {
        return this.value[i].value;
      }
    }
  }

  if (this.children !== null) {
    var val = null;
    for (var k = 0; k < this.children.length; k++) {
      val = val || this.children[k].queryPoint(point);
    }
    return val;
  }
  return null;
};

Quadtree.prototype.removePoint = function (point) {
  /*jshint maxstatements:20*/
  //return if tree doesn't contain point
  if (!this.box.contains(point)) {
    return;
  }

  var i;
  if (this.value.length > 0) {
    for (i = 0; i < this.value.length; i++) {
      if (this.value[i].point.equals(point)) {
        this.value.splice(i, 1);
        return;
      }
    }
    return; // didn't contain point and is leaf node
  }

  var k;
  if (this.children !== null) {
    for (k = 0; k < this.children.length; k++) {
      this.children[k].removePoint(point);
    }
  }
  return;
};

Quadtree.prototype.clear = function () {
  this.children = null;
  this.value = [];
};
