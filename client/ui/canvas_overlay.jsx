'use strict';/*global React*/

module.exports =
global.CanvasOverlay = React.createClass({
  getDefaultProps: function () {
    return {
    };
  },

  getInitialState: function () {
    return {
      style: {}
    };
  },

  render: function () {
    /*jshint white:false*/
    return (
      <div className="canvas-overlay" style={this.state.style}></div>
    );
  }
});

var CanvasOverlay = module.exports;

CanvasOverlay.safeRender = function (props) {
  /*jshint white:false*/
  var canvas_tile =
    <CanvasOverlay/>;

  return React.renderComponent(canvas_tile, props && props.parent);
};
