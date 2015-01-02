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

  shouldComponentUpdate: function () {
    return false;
  },

  render: function () {
    /*jshint white:false*/
    return (
      <div className="canvas-tile"
           style={this.state.style}>
        <div className="hash">
          {this.props.hash}
        </div>
        <canvas width={this.props.tile_size}
                height={this.props.tile_size}/>
      </div>
    );
  }
});
