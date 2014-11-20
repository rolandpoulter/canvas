'use strict';
/*global React, Tiles*/

require('../lib/Tiles.js');

var CanvasTile = require('./canvas_tile.jsx');

module.exports =
global.CanvasScroll = React.createClass({
  getDefaultProps: function () {
    var props = {
      view: null,
      tile_options: {}
    };
    return props;
  },

  getInitialState: function () {
    this.tiles = new Tiles(this.props.tile_options);

    this.resetInterval = setInterval(function () {
      this.tiles.reset(this.renderTile);
    }.bind(this), 10000);

    var state = {
      tiles: this.updateTileView()
    };

    return state;
  },

  handleResize: function () {
    this.updateViewState();
  },

  updateViewState: function () {
    var state = {
      tiles: this.updateTileView()
    };

    this.setState(state);
  },

  renderTile: function (cell, action) {
    /*jshint white:false*/
    if (action === 'new' && !cell.ref) {
      cell.setRef(<CanvasTile
        key={cell.key}
        hash={cell.key}
        bounds={cell}
        scroll={this}
        tile_size={this.tileSize}
        initial_screen_x={cell.left}
        initial_screen_y={cell.top}/>);
    }

    return cell;
  },

  updateTileView: function () {
    var bounds = this.props.view.worldBounds,
        tileSize = this.tileSize = 256,
        scale = this.scale = 1;

    this.tiles.setViewBounds(bounds, tileSize, scale);

    var tiles = this.tiles.update(this.renderTile);

    return tiles;
  },

  componentDidMount: function () {
    global.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function () {
    global.removeEventListener('resize', this.handleResize);
    clearInterval(this.resetInterval);
  },

  linkToView: function () {
    return (this.props.view.scroll = this);
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    var now = Date.now();
    this.nextTileUpdateTime = this.nextTileUpdateTime || now;
    if (nextState.tiles && this.nextTileUpdateTime <= now) {
      this.nextTileUpdateTime = now + 32;
      return true;
    }
    return false;
  },

  render: function () {
    this.linkToView();

    var tiles = this.state.tiles &&
      this.state.tiles.map(function (rect) {
        return rect.ref;
      });

    // console.log(tiles.length);

    /*jshint white:false*/
    return (
      <div className="canvas-scroll">
        {tiles}
      </div>
    );
  }
});

var CanvasScroll = module.exports;

CanvasScroll.safeRender = function (props) {
  /*jshint white:false*/
  var canvas_scroll =
    <CanvasScroll
      view={props.view}
      tile_options={props.tileOptions}/>;

  return React.renderComponent(canvas_scroll, props && props.parent);
};
