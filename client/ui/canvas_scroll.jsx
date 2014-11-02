'use strict';
/*global React, Tiles, Point*/

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
    this.updateTileView();
    this.state = {
      styles: {},
      tiles: this.tiles.view
    };
    return this.state;
  },

  handleResize: function () {
    this.updateViewState();
  },

  updateViewState: function () {
    this.updateTileView();
    var state = {
      tiles: this.tiles.view
    };
    // console.log(this.tiles);
    this.setState(state);
  },

  updateTileView: function () {
    var bounds = this.props.view.screenBounds;
    bounds = this.props.view.worldBounds;
    console.log('view bounds', bounds);
    this.tiles.resetView(bounds, 256, 1, function (cell) {
      /*jshint white:false*/
      if (!cell.ref) {
        var point = new Point(cell.left, cell.top).toScreenSpace(0, 0 ,1);
        cell.setRef(<CanvasTile
          hash={cell.hash}
          bounds={cell}
          scroll={this}
          tileSize={256}
          initialScreenX={point.x}
          initialScreenY={point.y}/>);
      }
      return cell;
    }.bind(this));
    // this.tiles.cullView(bounds);
    // console.log(this.tiles);
  },

  componentDidMount: function () {
    global.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function () {
    global.removeEventListener('resize', this.handleResize);
  },

  render: function () {
    this.props.view.scroll = this;

    var tiles = this.state.tiles &&
      this.state.tiles.map(function (rect) {
        return rect.ref;
      });
    /*jshint white:false*/
    return (
      <div className="canvas-scroll" style={this.state.styles}>
        {tiles}
      </div>
    );
  }
});
