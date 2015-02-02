'use strict';
/*global React, Point*/

require('./lib/Point.js');

module.exports =
global.CanvasEntity = React.createClass({
  getDefaultProps: function () {
    var props = {
      entity_data: {}
    };

    return props;
  },

  getInitialState: function () {
    var entity = this.props.entity_data;

    var coordinates = entity.shape && entity.shape.coordinates;

    var state = {
      scale: entity.scale,
      width: entity.width || coordinates &&
        Math.abs(coordinates[1][0] - coordinates[0][0]) || 0,
      height: entity.height || coordinates &&
        Math.abs(coordinates[1][1] - coordinates[0][1]) || 0,
      position: entity.position ?
        new Point(entity.position.x, entity.position.y) :
        coordinates ?
          new Point(coordinates[1][0] - coordinates[0][0]) :
          new Point(0, 0)
    };

    this.updateBounds(state);
    this.setupViewListener();

    return state;
  },

  updateBounds: function (state) {
    this.screenBounds = this.getScreenBounds(state);
    this.worldBounds = this.getWorldBounds(state);
  },

  getWorldBounds: function (state) {
    state = state || this.state;

    return this.screenBounds.toWorldSpace(state.scale);
  },

  getScreenBounds: function (state) {
    state = state || this.state;

    return new Point(
      state.position.x,
      state.position.y).toRectFromTopLeft(
          state.width,
          state.height);
  },

  setupViewListener: function () {
    app.onEntityUpdate(function (entity) {
      if (entity.id !== this.props.entity_data.id) return;

      var coordinates = entity.shape && entity.shape.coordinates;

      var state = {
        scale: entity.scale,
        width: entity.width || coordinates &&
          Math.abs(coordinates[1][0] - coordinates[0][0]) || 0,
        height: entity.height || coordinates &&
          Math.abs(coordinates[1][1] - coordinates[0][1]) || 0,
        position: new Point(entity.position.x, entity.position.y)
      };

      this.updateBounds(state);
      this.setState(state);
    }.bind(this));
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    /*jshint unused:false*/
    return true;
  },

  computeStyle: function (state) {
    state = state || this.state;

    if (!state) return {};

    var style = {};

    style.width = state.width + 'px';
    style.height = state.height + 'px';
    style.transform =
    style.WebkitTransform =
      'scale(' + state.scale + ')' +
      'translate(' +
        state.position.x + 'px,' +
        state.position.y + 'px)';

    return style;
  },

  render: function () {
    /*jshint white:false, nonbsp:false*/
    var style = this.computeStyle(),
        media = '';

    if (this.props.entity_data.meta.url) {
      media = <img src={this.props.entity_data.meta.url}/>;
    }

    return (
      <div className="canvas-entity"
           style={style}>
        <div className="position">
          {this.state.position.x},&nbsp;
          {this.state.position.y},&nbsp;
          {this.state.position.x + this.state.width},&nbsp;
          {this.state.position.y + this.state.height},&nbsp;
          {this.state.scale}
        </div>
        {media}
      </div>
    );
  }
});
