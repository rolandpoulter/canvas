'use strict';
/*global React, Tiles*/

require('./lib/Tiles.js');

var CanvasTile = require('./canvas_tile.jsx');

module.exports =
global.CanvasBuffer = React.createClass({
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
      this.resetTileView();
    }.bind(this), 10000);

    var state = {
      tiles: this.updateTileView()
    };

    return state;
  },

  handleResize: function () {
    this.resetTileView();
  },

  updateViewState: function (reset) {
    var state = {
      tiles: this.updateTileView(reset)
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

  resetTileView: function () {
    clearTimeout(this.resetTimer);
    this.tiles.clear();
    this.setState({tiles: []});
    this.resetTimer = setTimeout(function () {
      this.updateViewState();
      // setTimeout(this.updateTileView, 50);
    }.bind(this), 50);
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

    /*jshint white:false*/
    return (
      <div className="canvas-scroll">
        {tiles}
      </div>
    );
  }
});

var CanvasBuffer = module.exports;

CanvasBuffer.safeRender = function (props) {
  /*jshint white:false*/
  var canvas_buffer =
    <CanvasBuffer
      view={props.view}
      tile_options={props.tileOptions}/>;

  return React.renderComponent(canvas_buffer, props && props.parent);
};
