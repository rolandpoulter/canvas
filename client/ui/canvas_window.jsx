'use strict';/*global React*/

var CanvasTile = require('./canvas_tile.jsx');

module.exports =
global.CanvasWindow = React.createClass({
  getDefaultProps: function () {
    this.tileCache = [];
    return {
      depth: 64,
      fidelity: 2,
      initialX: 0.5,
      initialY: 0.5
    };
  },

  getInitialState: function () {
    return {
      x: this.props.initialY,
      y: this.props.initialX,
      z: this.depthToZ(this.props.depth),
      ratio: this.getWindowAspectRatio(),
      worldSize: Number.MAX_VALUE / this.props.fidelity,
      tileScreenSize: 512,
      styles: {
        width: global.innerWidth,
        height: global.innerHeight
      }
    };
  },

  getWindowAspectRatio: function () {
    return global.innerWidth / global.innerHeight;
  },

  depthToZ: function (depth) {
    return 1 / (depth * 2);
  },

  zToDepth: function () {
    var lowestZ = this.depthToZ(1),
        depth = 1,
        z = this.state.z;
    while (z !== lowestZ) {
      depth += 1;
      z /= 1 / 2;
    }
    return depth;
  },

  screenSpaceToWorldSpace: function (x, y, depth, context) {
    context = context || {};
    // TODO:
    context.x = x;
    context.y = y;
    if (depth) context.z = this.depthToZ(depth);
    return context;
  },

  worldSpaceToScreenSpace: function (x, y, z, context) {
    context = context || {};
    // TODO:
    context.x = x;
    context.y = y;
    if (z) context.depth = this.zToDepth(z);
    return context;
  },

  handleResize: function () {
    this.setState({
      ratio: this.getWindowAspectRatio(),
      styles: {
        width: global.innerWidth,
        height: global.innerHeight
      }
    });
    this.lazyFillTiles();
    this.lazyCullTiles();
  },

  lazyFillTiles: function () {
    global.clearTimeout(this.fillTimeout);
    var msSinceLast = Date.now() - this.lastFillTime,
        maxWaitMs = 1000 / 24,
        deferMs =   1000 / 100;
    if (msSinceLast > maxWaitMs) this.fillTiles();
    else this.fillTimeout = global.setTimeout(this.fillTiles, deferMs);
  },

  fillTiles: function () {
    this.tiles = this.tiles || [];
    var canvas_window = this,
        intersecting_tiles = [],
        new_tiles = [];
    intersecting_tiles.quadtreeAABB(function (hash) {
      var exists = canvas_window.tiles.some(function (current_tile) {
        return current_tile.props.hash === hash;
      });
      /*jshint white:false*/
      if (!exists) new_tiles.push(
        <CanvasTile hash={hash} tileSize={canvas_window.props.tileSize}/>
      );
      /*jshint white:true*/
    });
    this.lastFillTime = Date.now();
    return new_tiles;
  },

  lazyCullTiles: function () {
    global.clearTimeout(this.cullTimeout);
    var msSinceLast = Date.now() - this.lastCullTime,
        maxWaitMs = 1000 * 5,
        deferMs =   1000 / 10;
    if (msSinceLast > maxWaitMs) this.cullTiles();
    else this.cullTimeout = global.setTimeout(this.cullTiles, deferMs);
  },

  cullTiles: function () {
    var tiles = [];
    // TODO:
    this.lastCullTime = Date.now();
    return tiles;
  },

  shiftTilesX: function (amount) {
    return amount;// TODO:
  },

  shiftTilesY: function (amount) {
    return amount;// TODO:
  },

  devideTiles: function (amount) {
    return amount;// TODO:
  },

  multiplyTiles: function (amount) {
    return amount;// TODO:
  },

  // translate: function () {
  //   return;// TODO:
  // },

  // scale: function () {
  //   return;// TODO:
  // },

  componentDidMount: function () {
    global.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function () {
    global.removeEventListener('resize', this.handleResize);
  },

  render: function () {
    /*jshint white:false*/
    return (
      <div className="canvas-wall" style={this.state.styles}>
        {this.tiles}
        {this.fillTiles()}
      </div>
    );
  }
});

var CanvasWindow = module.exports;

CanvasWindow.safeRender = function (props) {
  /*jshint white:false*/
  var canvas_window = <CanvasWindow
    depth={props.depth}
    fidelity={props.fidelity}
    initialX={props.initialX}
    initialY={props.initialY}/>;
  return React.renderComponent(canvas_window, props && props.parent);
};

Array.prototype.quadtreeAABB = function (cb) {
  cb(0);
  cb(1);
  cb(2);
  cb(3);
};

Array.prototype.quadtreeIndex = function (x, y, depth) {
  return depth; // TODO:
};
