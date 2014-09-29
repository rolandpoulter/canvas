'use strict';/*global React*/

// TODO:
// consider changing the world space to screen space transition
// it would be neat if I used the window scrollTop and scrollLeft
// properties for translation, then I would get scrolling around for free.
//
// I would need to make a giant div element to represent the entire wall
// then scroll to the center and update the math

var CanvasTile = require('./canvas_tile.jsx');

Number.MAX_SCREEN_OFFSET = 33554428;

module.exports =
global.CanvasWindow = React.createClass({
  getDefaultProps: function () {
    this.tileCache = [];
    return {
      depth: 64,
      fidelity: 1,
      initialX: 0,
      initialY: 0,
      maxWorldSize: Number.MAX_SCREEN_OFFSET,
      tileScreenSize: 512,
    };
  },

  getInitialState: function () {
    var p = this.props,
        x = p.initialX,
        y = p.initialY,
        w = global.innerWidth,
        h = global.innerHeight,
        w2 = w / 2,
        h2 = h / 2,
        s = p.maxWorldSize / p.fidelity;
    this.state = {
      x: x,
      y: y,
      z: this.depthToZ(p.depth),
      ratio: this.getWindowAspectRatio(),
      worldSize: p.maxWorldSize / p.fidelity,
      screenOffsetX: w2,
      screenOffsetY: h2,
      styles: {
        width: w,
        height: h,
        top: h2 - y * s,
        left: w2 - x * s
      }
    };
    var aabb = this.getAABB(),
        c1 = this.screenSpaceToWorldSpace(aabb[0], aabb[1]),
        c2 = this.screenSpaceToWorldSpace(aabb[2], aabb[3]);
    console.log(
      this.state.styles,
      aabb,
      c1,
      c2,
      this.worldSpaceToScreenSpace(c1.x, c1.y),
      this.worldSpaceToScreenSpace(c2.x, c2.y));
    return this.state;
  },

  handleResize: function () {
    var p = this.props,
        x = this.state.x,
        y = this.state.y,
        w = global.innerWidth,
        h = global.innerHeight,
        w2 = w / 2,
        h2 = h / 2,
        s = p.maxWorldSize / p.fidelity;
    this.setState({
      ratio: this.getWindowAspectRatio(),
      screenOffsetX: w2,
      screenOffsetY: h2,
      styles: {
        width: w,
        height: h,
        top: h2 - y * s,
        left: w2 - x * s
      }
    });
    // console.log(this.state.styles);
    this.lazyFillTiles();
    this.lazyCullTiles();
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
    var s = this.state;
    context.x = (x - s.screenOffsetX) / s.worldSize;
    context.y = (y - s.screenOffsetY) / s.worldSize;
    if (depth) context.z = this.depthToZ(depth);
    return context;
  },

  worldSpaceToScreenSpace: function (x, y, z, context) {
    context = context || {};
    var s = this.state;
    context.x = (x * s.worldSize);// + s.screenOffsetX;
    context.y = (y * s.worldSize);// + s.screenOffsetY;
    if (z) context.depth = this.zToDepth(z);
    return context;
  },

  getAABB: function (element) {
    var b = element || global.document.body,
        x1 = b.offsetLeft,
        y1 = b.offsetTop,
        p = b.offsetParent;
    while (p) {
      x1 += p.offsetLeft;
      y1 += p.offsetTop;
      p = p.offsetParent;
    }
    var x2 = x1 + b.offsetWidth,
        y2 = y1 + (b.offsetHeight || global.innerHeight);
    return [x1, y1, x2, y2];
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
        <CanvasTile key={hash}
                    hash={hash}
                    tileSize={canvas_window.props.tileSize}/>
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
    parent={this}
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
