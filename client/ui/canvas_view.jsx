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
    var style = {};
    style.transform = style['-webkit-transform'] =
      'translate(' +
        this.props.initial_x + '10px,' +
        this.props.initial_y + '10px)';
    this.state = {
      scale: this.props.initial_scale,
      style: style,
      position: new Point(this.props.initial_x, this.props.initial_y)
    };

    this.screenBounds = this.getScreenBounds();
    this.worldBounds = this.getWorldBounds();

    return this.state;
  },

  handleZoomIn: function () {
    // console.log(this.state);
    // debugger;
    this.setState({
      scale: this.state.scale * 2,
      position: this.state.position.scale(2)
    });
    setTimeout(function () {
      // console.log(this.state);
      // console.log(this.screenBounds);
      // console.log(this.worldBounds);
      this.updateBounds();
      // console.log(this.screenBounds);
      // console.log(this.worldBounds);
      setTimeout(function () {
        this.updateTransform();
        // console.log(this.state);
        this.updateTileScroll();
      }.bind(this), 32);
    }.bind(this), 32);
  },

  handleZoomOut: function () {
    this.setState({
      scale: this.state.scale / 2,
      position: this.state.position.divide(2)
    });
    this.updateBounds();
    setTimeout(function () {
      this.updateTransform();
      this.updateTileScroll();
    }.bind(this), 32);
  },

  updateBounds: function () {
    this.screenBounds = this.getScreenBounds();
    this.worldBounds = this.getWorldBounds();
  },

  updateTransform: function () {
    var s = this.state.scale,
        p = this.state.position;
    var style = {};
    style.transform = style['-webkit-transform'] =
      'scale(' + s + ') translate(' + p.x + 'px, ' + p.y + 'px)';
    this.setState({
      style: style
    });
  },

  handleResize: function () {
    this.updateBounds();
  },

  captureLastMousePosition: function (event) {
    this.lastMousePosition = new Point(event.screenX, event.screenY);
  },

  handleTouchStart: function (event) {
    var touch;
    if (!this.firstTouchId) {
      touch = event.touches[0];
      this.firstTouchId = touch.identifier;
      this.handleMouseDown(touch);
    }
  },

  handleTouchMove: function (event) {
    event.preventDefault();
    var touches = event.touches,
        touch,
        l = touches.length,
        i = 0;
    for (; i < l; i += 1) {
      touch = touches[i];
      if (touch && touch.identifier === this.firstTouchId) break;
      touch = null;
    }
    if (!touch) return;
    this.handleMouseMove(touch);
  },

  handleTouchStop: function (event) {
    var touches = event.touches,
        touch,
        l = touches.length,
        i = 0;
    for (; i < l; i += 1) {
      touch = touches[i];
      if (touch && touch.identifier === this.firstTouchId) break;
      touch = null;
    }
    if (!touch) {
      delete this.firstTouchId;
      this.handleMouseUp();
    }
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
        this.updateTileScroll();

        // Allow another move to queue.
        delete this.mouseMoveFrameWaiting;
      }.bind(this));
    }
  },

  handleMouseUp: function () {
    delete this.lastMousePosition;
  },

  updateTileScroll: function () {
    if (this.refs.scroll && !this.updateScrollWaiting) {
      this.updateScrollWaiting = true;

      window.requestAnimationFrame(function () {
        this.refs.scroll.updateViewState();

        delete this.updateScrollWaiting;
      }.bind(this));
    }
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
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchmove', this.handleTouchStop);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchmove', this.handleTouchStop);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    if (nextState.style) return true;
    return false;
  },

  render: function () {
    /*jshint white:false, nonbsp:false*/
    // console.log(this.state.style);
    return (
      <div className="canvas-view"
           onTouchStart={this.handleTouchStart}
           onTouchMove={this.handleTouchMove}
           onTouchCancel={this.handleTouchStop}
              onTouchEnd={this.handleTouchStop}
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
          &nbsp;|&nbsp;
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
