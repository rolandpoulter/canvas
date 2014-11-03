'use strict';/*global React*/

module.exports =
global.CanvasTile = React.createClass({
  getDefaultProps: function () {
    return {
      hash: null,
      bounds: null,
      scroll: null,
      tile_size: 512,
      initial_screen_x: 0,
      initial_screen_y: 0
    };
  },

  getInitialState: function () {
    return {
      style: {
        height: this.props.tile_size,
        width: this.props.tile_size,
        left: this.props.initial_screen_x,
        top:  this.props.initial_screen_y
      }
    };
  },

  render: function () {
    /*jshint white:false*/
    return (
      <div className="canvas-tile" style={this.state.style}>
        <span>{this.props.hash}</span>
        <canvas width={this.props.tile_size}
                height={this.props.tile_size}/>
      </div>
    );
  }
});

var CanvasTile = module.exports;

CanvasTile.safeRender = function (props) {
  /*jshint white:false*/
  var canvas_tile =
    <CanvasTile
      hash={props.hash}
      bounds={props.bounds}
      scroll={props.scroll}
      tile_size={props.tileSize}
      initial_screen_x={props.initialScreenX}
      initial_screen_y={props.initialScreenY}/>;

  return React.renderComponent(canvas_tile, props && props.parent);
};
