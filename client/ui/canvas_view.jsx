'use strict';
/*global React, Point, window*/

require('../lib/Point.js');

var CanvasScroll = require('./canvas_scroll.jsx'),
    CanvasOverlay = require('./canvas_overlay.jsx');

// var session = require('../io/session.js'),
    // identifier = require('../io/identifier.js'),
    // entity = require('../io/entity.js');

module.exports =
global.CanvasView = React.createClass({
  getDefaultProps: function () {
    var props = {
      view_id: app.session.view_id,
      initial_x: 0,
      initial_y: 0,
      initial_scale: 1,
      tile_options: {}
    };

    return props;
  },

  getInitialState: function () {
    var state = {
      scale: this.props.initial_scale,
      position: new Point(
        this.props.initial_x,
        this.props.initial_y)
    };

    this.updateBounds(state);
    this.setupViewListener();

    return state;
  },

  updateBounds: function (state) {
    this.screenBounds = this.getScreenBounds(state);
    this.worldBounds = this.getWorldBounds(state);
  },

  getWorldBounds: function (state) {
    state = state || this.state;

    return this.screenBounds.toWorldSpace(state.scale);
  },

  getScreenBounds: function (state) {
    state = state || this.state;

    return new Point(
      -state.position.x,
      -state.position.y).toScreenRect(
          state.scale,
          window.innerWidth,
          window.innerHeight);
  },

  getWindowSize: function () {
    return new Point(
      global.innerWidth,
      global.innerHeight);
  },

  getWindowAspectRatio: function () {
    return global.innerWidth /
           global.innerHeight;
  },

  setupViewListener: function () {
    app.onEntityUpdate(function (entity) {
      console.log(entity);
    });
    // session.onceSessionReady(function (session) {
    //   var that = this, t;
    //   view.onmessage = function (event) {
    //     that.noEMIT = true;
    //     clearTimeout(t);
    //     var view = JSON.parse(event.data),
    //         state = {position: view.position};
    //     if (session.view_id) finish(session.view_id);
    //
    //     else identifier.getObjectId(finish);
    //
    //     function finish(view_id) {
    //       state.view_id = session.view_id;
    //       that.updateBounds(state);
    //       that.setState(state);
    //     }
    //   };
    // }.bind(this));
  },

  updateTileScroll: function () {
    if (!this.updateScrollWaiting) {
      this.updateScrollWaiting = true;

      window.requestAnimationFrame(updateScroll.bind(this));
    }

    function updateScroll() {
      /*jshint validthis:true*/
      if (!this.refs || !this.refs.scroll) {
        delete this.updateScrollWaiting;

        return this.updateTileScroll();
      }

      this.refs.scroll.updateViewState();

      delete this.updateScrollWaiting;
    }
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    /*jshint unused:false*/
    this.broadcastState();

    return true;
  },

  broadcastState: function () {
    if (!this.noEMIT) {
      app.setEntity(this.props.view_id, this.state, function () {});
      // session.onceSessionReady(function () {
      //   view.send(JSON.stringify(this.state));
      // }.bind(this));
    }
  },

  computeStyle: function (state) {
    state = state || this.state;

    if (!state) return {};

    var style = {};

    style.transform =
    style['-webkit-transform'] =
      'scale(' + state.scale + ')' +
      'translate(' +
        state.position.x + 'px,' +
        state.position.y + 'px)';

    return style;
  },

  render: function () {
    /*jshint white:false, nonbsp:false*/
    var style = this.computeStyle();

    this.updateTileScroll();

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
             style={style}>
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

  handleZoomIn: function () {
    var state = {
      scale: this.state.scale * 2,
      position: this.state.position.scale(2)
    };

    this.updateBounds(state);
    this.setState(state);
  },

  handleZoomOut: function () {
    var state = {
      scale: this.state.scale / 2,
      position: this.state.position.divide(2)
    };
    this.updateBounds(state);
    this.setState(state);
  },

  handleResize: function () {
    this.updateBounds();
  },

  captureLastMousePosition: function (event) {
    this.lastMousePosition =
      new Point(
        event.screenX,
        event.screenY);
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
    delete this.noEMIT;

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
        var state = {
          position: new Point(
            this.state.position.x - diffX * scale,
            this.state.position.y - diffY * scale)
        };

        this.updateBounds(state);
        this.setState(state);

        // Allow another move to queue.
        delete this.mouseMoveFrameWaiting;
      }.bind(this));
    }
  },

  handleMouseUp: function () {
    delete this.lastMousePosition;
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
