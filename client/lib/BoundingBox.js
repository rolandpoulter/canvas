'use strict';

module.exports = BoundingBox;

function BoundingBox(model) {
  this.model = model;
  this.box = null;
}

BoundingBox.prototype.updateBox = function (box) {
  this.box = box = box || this.model.box;
  box.length = 4;
  box[0] = -1;
  box[1] = -1;
  box[2] = 1;
  box[3] = 1;
  box.model = this.model;
  return this._calculateBox(this.model, box);
};

BoundingBox.prototype.intersects = function (boxA, boxB) {
  return boxB[0] < boxA[2] ||
         boxB[1] < boxA[3] ||
         boxB[2] > boxA[0] ||
         boxB[3] > boxA[1];
};

BoundingBox.prototype._calculateBox = function (model, box) {
  /*jshint maxstatements:20, maxcomplexity:10*/
  var params = {
    scale: model.scale || 1,
    offset: [
      model.offset[0] || 0,
      model.offset[1] || 0
    ]
  };
  if (model.parent) params = this._adjustParams(model.parent, params);
  box[0] *= params.scale;
  box[1] *= params.scale;
  box[2] *= params.scale;
  box[3] *= params.scale;
  box[0] += params.offset[0];
  box[1] += params.offset[1];
  box[2] += params.offset[0];
  box[3] += params.offset[1];
  if (model._calculateBox) box = model._calculateBox(box) || box;
  return box;
};

BoundingBox.prototype._adjustParams = function (model, params) {
  if (model.parent) params = this._adjustParams(model.parent, params);
  params.scale *= model.scale;
  params.offset[0] += model.offset[0] * params.scale;
  params.offset[1] += model.offset[1] * params.scale;
  return params;
};
