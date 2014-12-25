'use strict';
/*global React, Point*/

require('../lib/Point.js');

module.exports =
global.BoundsMixin = React.createClass({
  updateBounds: function (state) {
    this.screenBounds = this.getScreenBounds(state);
    this.worldBounds = this.getWorldBounds(state);
  },

  getWorldBounds: function (state) {
    state = state || this.state;

    var scale = state.scale || 1;

    return this.screenBounds.toWorldSpace(scale);
  },

  getScreenBounds: function (state) {
    state = state || this.state;

    var position = state.position || {x: 0, y: 0},
        height = state.height || 2,
        width = state.width || 2,
        scale = state.scale || 1,
        point = new Point(-position.x, -position.y);

    return point.toScreenRect(scale, width, height);
  }
});
