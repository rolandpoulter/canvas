'use strict';
/*global React, Point, window*/

require('../lib/Point.js');

var CanvasScroll = require('./canvas_scroll.jsx');

module.exports =
global.CanvasView = React.createClass({
  getDefaultProps: function () {
    var state = {
      initial_x: 0,
      initial_y: 0,
      initial_scale: 1
    };
    return state;
  },

  getInitialState: function () {
    this.state = {
      scale: this.props.initial_scale,
      styles: {},
      position: new Point(this.props.initial_x, this.props.initial_y)
    };
    this.screenBounds = this.getScreenBounds();
    this.worldBounds = this.getWorldBounds();
    // console.log(this.screenBounds, this.worldBounds);
    return this.state;
  },

  updateBounds: function () {
    this.screenBounds = this.getScreenBounds();
    this.worldBounds = this.getWorldBounds();
    console.log('sc', this.screenBounds.getCenter());
    console.log('wc', this.worldBounds.getCenter().toScreenSpace());
  },

  handleResize: function () {
    this.updateBounds();
  },

  captureLastMousePosition: function (event) {
    this.lastMousePosition = new Point(event.screenX, event.screenY);
  },

  handleMouseDown: function (event) {
    this.captureLastMousePosition(event);
  },

  handleMouseMove: function (event) {
    if (!this.lastMousePosition) return;
    var diffX = this.lastMousePosition.x - event.screenX,
        diffY = this.lastMousePosition.y - event.screenY;
    this.captureLastMousePosition(event);
    this.setState({position: new Point(
      this.state.position.x + diffX,
      this.state.position.y + diffY)});
    this.updateBounds();
    if (this.scroll) this.scroll.updateViewState();
  },

  handleMouseUp: function () {
    delete this.lastMousePosition;
  },

  getWorldBounds: function () {
    return this.screenBounds.toWorldSpace(
      0,
      0,
      this.state.scale);
  },

  getScreenBounds: function () {
    var p = this.state.position;
    // console.log(p);
    return new Point(p.x, p.y)
      .toRectFromTopLeft(window.innerWidth, -window.innerHeight);
  },

  getWindowSize: function () {
    return new Point(global.innerWidth, global.innerHeight);
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
      <div className="canvas-view" style={this.state.styles}
           onMouseDown={this.handleMouseDown}
           onMouseMove={this.handleMouseMove}
           onMouseUp={this.handleMouseUp}>
        <span>{this.state.position.x}</span>,
        <span>{this.state.position.y}</span>
        <CanvasScroll view={this}/>
      </div>
    );
  }
});

var CanvasView = module.exports;

CanvasView.safeRender = function (props) {
  /*jshint white:false*/
  var canvas_window = <CanvasView
    initial_x={props.initialX}
    initial_y={props.initialY}
    initial_scale={props.initialScale}/>;
  return React.renderComponent(canvas_window, props && props.parent);
};
