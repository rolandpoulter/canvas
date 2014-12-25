'use strict';
/*global React, Point, window*/

require('./lib/Point.js');

var CanvasBuffer = require('./canvas_buffer.jsx'),
    CanvasOverlay = require('./canvas_overlay.jsx'),
    CanvasEntity = require('./canvas_entity.jsx');

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
    this.getVisibleEntities();

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

  setupViewListener: function () {
    app.onEntityUpdate(viewEntityHandler.bind(this));

    function viewEntityHandler(entity) {
      /*jshint validthis:true*/
      if (entity.id !== this.props.view_id) return;

      this.shouldBroadcastWait = true;

      var state = {position: entity.position};

      this.updateBounds(state);
      this.setState(state);
    }
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
    if (this.shouldBroadcastWait) return;

    this.saveViewEntity();
    this.getVisibleEntities();
  },

  saveViewEntity: function () {
    if (!this.delaySetEntity) {
      this.delaySetEntity = true;

      var entity = {
        // user: null,
        // wall: null,
        // meta: {},
        // name: 'undefined',
        // type: 'undefined',
        mdate: Date.now(),
        shape: this.worldBounds.toGeoJSON(),
        layer: 0,
        scale: 1,
        hidden: false,
        position: this.state.position
      };

      app.setEntity(this.props.view_id, entity, function () {
        delete this.delaySetEntity;
      }.bind(this));
    }
  },

  getVisibleEntities: function () {
    var query = {
      shape: {
        $geoIntersects: this.worldBounds.toGeoJSON()
      }
    };

    if (!this.delayGetEntities) {
      this.delayGetEntities = true;

      app.getEntities(query, function (err, entities) {
        delete this.delayGetEntities;

        entities = entities.filter(function (entity) {
          return this.props.view_id !== entity.id;
        }.bind(this));

        this.setState({entities: entities});
        this.shouldBroadcastWait = true;

        setTimeout(function () {
          console.log('visible', this.state.entities);

          delete this.shouldBroadcastWait;
        }.bind(this), 20);
      }.bind(this));
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

    var entities = this.state.entities &&
      this.state.entities.map(function (entity) {
        return <CanvasEntity key={entity.id}
                             entity_data={entity}/>;
      });

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
          <CanvasBuffer ref="scroll"
                        view={this}
                        tile_options={this.props.tile_options}/>
          <div className="canvas-view-entities">
            {entities}
          </div>
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
    if (this.firstTouchId) return;

    touch = event.touches[0];

    this.firstTouchId = touch.identifier;

    this.handleMouseDown(touch);
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

    if (touch) this.handleMouseMove(touch);
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

    if (touch) return;

    delete this.firstTouchId;

    this.handleMouseUp();
  },

  handleMouseDown: function (event) {
    delete this.shouldBroadcastWait;

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
      window.requestAnimationFrame(updateViewPosition.bind(this));
    }

    function updateViewPosition() {
      /*jshint validthis:true*/
      var state = {
        position: new Point(
          this.state.position.x - diffX * scale,
          this.state.position.y - diffY * scale)
      };

      this.updateBounds(state);
      this.setState(state);

      // Allow another move to queue.
      delete this.mouseMoveFrameWaiting;
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
