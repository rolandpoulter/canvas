'use strict';
/*global React, Point, window*/

require('../lib/Point.js');

var CanvasScroll = require('./canvas_scroll.jsx'),
    CanvasOverlay = require('./canvas_overlay.jsx');

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
          this.props.initial_x + 'px,' +
          this.props.initial_y + 'px)'
      },
      position: new Point(this.props.initial_x, this.props.initial_y)
    };

    this.screenBounds = this.getScreenBounds();
    this.worldBounds = this.getWorldBounds();

    return this.state;
  },

  handleZoomIn: function () {
    this.setState({scale: this.state.scale * 2});
    this.updateBounds();
    this.updateTransform();
  },

  handleZoomOut: function () {
    this.setState({scale: this.state.scale / 2});
    this.updateBounds();
    this.updateTransform();
  },

  updateBounds: function () {
    this.screenBounds = this.getScreenBounds();
    this.worldBounds = this.getWorldBounds();
  },

  updateTransform: function () {
    var s = this.state.scale,
        p = this.state.position.copy().scale(s);
    this.setState({
      style: {
        transform: 'scale(' + s + ') translate(' + p.x + 'px, ' + p.y + 'px)'
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

      var scale = this.state.scale,
          diffX = this.lastMousePosition.x - event.screenX,
          diffY = this.lastMousePosition.y - event.screenY;

      this.captureLastMousePosition(event);

      // Render on next animation frame.
      window.requestAnimationFrame(function () {
        this.setState({position: new Point(
          this.state.position.x - diffX * scale,
          this.state.position.y - diffY * scale)});

        this.updateBounds();
        this.updateTransform();

        if (this.refs.scroll && !this.updateScrollWaiting) {
          this.updateScrollWaiting = true;

          window.requestAnimationFrame(function () {
            this.refs.scroll.updateViewState();

            delete this.updateScrollWaiting;
          }.bind(this));
        }

        // Allow another move to queue.
        delete this.mouseMoveFrameWaiting;
      }.bind(this));
    }
  },

  handleMouseUp: function () {
    delete this.lastMousePosition;
  },

  getWorldBounds: function () {
    return this.screenBounds.toWorldSpace(this.state.scale);
  },

  getScreenBounds: function () {
    var p = this.state.position;

    return new Point(-p.x, -p.y)
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
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    if (nextState.style) return true;
    return true;
  },

  render: function () {
    /*jshint white:false, nonbsp:false*/
    return (
      <div className="canvas-view"
           onMouseDown={this.handleMouseDown}
           onMouseMove={this.handleMouseMove}
           onMouseUp={this.handleMouseUp}>
        <div className="position">
          {this.state.position.x},&nbsp;
          {this.state.position.y},&nbsp;
          {this.state.scale}
        </div>
        <div className="canvas-view-transform"
             style={this.state.style}>
          <CanvasScroll ref="scroll"
                        view={this}
                        tile_options={this.props.tile_options}/>
        </div>
        <CanvasOverlay ref="overlay"/>
        <div className="buttons">
          <a href="#"
             className="button zoom-in"
             onClick={this.handleZoomIn}>Zoom In</a>
          <a href="#"
             className="button zoom-out"
             onClick={this.handleZoomOut}>Zoom Out</a>
        </div>
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
