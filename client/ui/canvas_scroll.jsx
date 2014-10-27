'use strict';
/*global React*/

var CanvasTile = require('./canvas_tile.jsx');

module.exports =
global.CanvasScroll = React.createClass({
  getDefaultProps: function () {
    var state = {};
    return state;
  },

  getInitialState: function () {
    var state = {
      styles: {}
    };
    return state;
  },

  handleResize: function () {
    var state = {
      styles: {}
    };
    return state;
  },

  getWindowAspectRatio: function () {
    return global.innerWidth / global.innerHeight;
  },

  componentDidMount: function () {
    global.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function () {
    global.removeEventListener('resize', this.handleResize);
  },

  render: function () {
    /*jshint white:false*/
    return (
      <div className="canvas-scroll" style={this.state.styles}>
        <CanvasTile/><CanvasTile/><CanvasTile/><CanvasTile/>
      </div>
    );
  }
});

var CanvasWindow = module.exports;

CanvasWindow.safeRender = function (props) {
  /*jshint white:false*/
  var canvas_window = <CanvasWindow
    depth={props.depth}
    parent={this}
    fidelity={props.fidelity}
    initialX={props.initialX}
    initialY={props.initialY}/>;
  return React.renderComponent(canvas_window, props && props.parent);
};