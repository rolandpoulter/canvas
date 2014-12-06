'use strict';

// http://www.gamedev.net/page/resources/_/technical/game-programming/spatial-hashing-r2697

var DEFAULT_POWER_OF_TWO = 5;

module.exports = global.SpatialHash = SpatialHash;

/**
* @param {number} powerOfTwo - how many times the rects should be shifted
*                                when hashing
*/
function SpatialHash(powerOfTwo) {
  this._powerOfTwo = powerOfTwo || DEFAULT_POWER_OF_TWO;

  this.hash = {};
}


SpatialHash.prototype.getKeys = function (rect) {
  /*jshint bitwise:false*/
  var shift = this._powerOfTwo,
      sx = rect.left   >> shift,
      sy = rect.top    >> shift,
      ex = rect.right  >> shift,
      ey = rect.bottom >> shift,
      x = sx,
      y = sy,
      keys = [];

  for (; y <= ey; y += 1)
    for (; x <= ex; x += 1)
      keys.push(x + ':' + y);

  return keys;
};

SpatialHash.prototype.clear = function () {
  var key;

  for (key in this.hash) {
    if (this.hash[key].length === 0)
      delete this.hash[key];

    else
      this.hash[key].length = 0;
  }
};

SpatialHash.prototype.getNumBuckets = function () {
  var key,
      count = 0;

  for (key in this.hash)
    if (this.hash.hasOwnProperty(key))
      if (this.hash[key].length > 0)
        count += 1;

  return count;
};

SpatialHash.prototype.insert = function (rect, ref) {
  var keys = this.getKeys(rect),
      key,
      itm,
      i;

  if (ref) rect.setRef = ref;

  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    itm = this.hash[key];

    if (itm) itm.push(rect);

    else this.hash[key] = [rect];
  }
};

SpatialHash.prototype.remove = function (rect) {
  var keys = this.getKeys(rect),
      key,
      itm,
      iof,
      i;

  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    itm = this.hash[key];

    if (itm) {
      iof = this.hash[key].indexOf(rect);

      if (iof !== -1) this.hash[key].splice(iof, 1);
    }
  }
};

SpatialHash.prototype.retrieve = function (rect) {
  var ret = [], keys, i, key;

  keys = this.getKeys(rect);

  for (i = 0; i < keys.length; i++) {
    key = keys[i];

    if (this.hash[key])
      ret = ret.concat(this.hash[key]);
  }

  return ret;
};
