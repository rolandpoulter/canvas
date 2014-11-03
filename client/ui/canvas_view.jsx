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
      initial_scale: 1,
      tile_options: {}
    };
    return state;
  },

  getInitialState: function () {
    this.state = {
      scale: this.props.initial_scale,
      style: {
        transform: 'translate(' +
          this.props.initial_x + ',' +
          this.props.initial_y + ')'
      },
      position: new Point(this.props.initial_x, this.props.initial_y)
    };

    this.screenBounds = this.getScreenBounds();
    this.worldBounds = this.getWorldBounds();

    return this.state;
  },

  updateBounds: function () {
    this.screenBounds = this.getScreenBounds();
    this.worldBounds = this.getWorldBounds();
  },

  updateTransform: function () {
    this.setState({
      style: {
        transform: 'translate(' +
          this.state.position.x + 'px,' +
          this.state.position.y + 'px)'
      }
    });
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

    // Wait till next animation frame in order to queue up another move.
    if (!this.mouseMoveFrameWaiting) {
      this.mouseMoveFrameWaiting = true;

      var diffX = this.lastMousePosition.x - event.screenX,
          diffY = this.lastMousePosition.y - event.screenY;

      this.captureLastMousePosition(event);

      // Render on next animation frame.
      window.requestAnimationFrame(function () {
        this.setState({position: new Point(
          this.state.position.x - diffX,
          this.state.position.y - diffY)});

        this.updateBounds();
        this.updateTransform();

        if (this.scroll) this.scroll.updateViewState();

        // Allow another move to queue.
        delete this.mouseMoveFrameWaiting;
      }.bind(this));
    }
  },

  handleMouseUp: function () {
    delete this.lastMousePosition;
  },

  getWorldBounds: function () {
    return this.screenBounds.toWorldSpace(0, 0, 1);
  },

  getScreenBounds: function () {
    var p = this.state.position;

    return new Point(p.x, p.y)
      .toScreenRect(
        this.state.scale,
        window.innerWidth,
        window.innerHeight);
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
      <div className="canvas-view" style={this.state.style}
           onMouseDown={this.handleMouseDown}
           onMouseMove={this.handleMouseMove}
           onMouseUp={this.handleMouseUp}>
        <span>{this.state.position.x}</span>,
        <span>{this.state.position.y}</span>
        <CanvasScroll view={this}
                      tile_options={this.props.tile_options}/>
      </div>
    );
  }
});

var CanvasView = module.exports;

CanvasView.safeRender = function (props) {
  /*jshint white:false*/
  var canvas_view =
    <CanvasView
      initial_x={props.initialX}
      initial_y={props.initialY}
      initial_scale={props.initialScale}
      tile_options={props.tileOptions}/>;

  return React.renderComponent(canvas_view, props && props.parent);
};
