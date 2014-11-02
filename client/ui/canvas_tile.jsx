'use strict';/*global React*/

module.exports =
global.CanvasTile = React.createClass({
  getDefaultProps: function () {
    this.tileCache = [];
    return {
      hash: null,
      bounds: null,
      scroll: null,
      tileSize: 512,
      initialScreenX: 0,
      initialScreenY: 0
    };
  },

  getInitialState: function () {
    return {
      style: {
        height: this.props.tileSize,
        width: this.props.tileSize,
        left: this.props.initialScreenX,
        top:  this.props.initialScreenY
      }
    };
  },

  render: function () {
    /*jshint white:false*/
    return (
      <div className="canvas-tile" style={this.state.style}>
        <span>{this.props.hash}</span>
        <canvas width={this.props.tileSize}
                height={this.props.tileSize}/>
      </div>
    );
  },

  intersectsWindow: function () {}
});
