'use strict';
/*global React, Point, window*/

require('../lib/Rect.js');
require('../lib/Point.js');

var CanvasTile = require('./canvas_tile.jsx');

module.exports =
global.CanvasView = React.createClass({
  getDefaultProps: function () {
    var state = {};
    return state;
  },

  getInitialState: function () {
    var state = {
      styles: {}
    };
    this.rect = new Point(0, 0).toRectFromTopLeft(
      window.innerWidth,
      -window.innerHeight);
    // console.log(this.rect);
    // this.test = this.rect.toWorldSpace();
    // console.log(this.test);
    // console.log(this.test.toScreenSpace());
    // debugger;
    return state;
  },

  handleResize: function () {
    var state = {
      styles: {}
    };
    // this.rect = new Point(0, 0).toRectFromTopLeft(
    //   window.innerWidth,
    //   -window.innerHeight);
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
      <div className="canvas-view" style={this.state.styles}>
      </div>
    );
  }
});

var CanvasView = module.exports;

CanvasView.safeRender = function (props) {
  /*jshint white:false*/
  var canvas_window = <CanvasView/>;
    // depth={props.depth}
    // parent={this}
    // fidelity={props.fidelity}
    // initialX={props.initialX}
    // initialY={props.initialY}
  return React.renderComponent(canvas_window, props && props.parent);
};
