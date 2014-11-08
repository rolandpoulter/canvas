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

    this.state = {
      tiles: this.updateTileView()
    };

    return this.state;
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

  updateTileView: function () {
    var bounds = this.props.view.worldBounds,
        tileSize = 256,
        scale = 1;

    this.tiles.setViewBounds(bounds, tileSize, scale);

    return this.tiles.update(function (cell, action) {
      /*jshint white:false*/
      if (action === 'new' && !cell.ref) {
        cell.setRef(<CanvasTile
          key={cell.key}
          hash={cell.key}
          bounds={cell}
          scroll={this}
          tile_size={tileSize}
          initial_screen_x={cell.left}
          initial_screen_y={cell.top}/>);
      }

      return cell;
    }.bind(this));
  },

  componentDidMount: function () {
    global.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function () {
    global.removeEventListener('resize', this.handleResize);
  },

  linkToView: function () {
    return (this.props.view.scroll = this);
  },

  render: function () {
    this.linkToView();

    var tiles = this.state.tiles &&
      this.state.tiles.map(function (rect) {
        return rect.ref;
      });

    /*jshint white:false*/
    return (
      <div className="canvas-scroll"
           style={this.state.style}>
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
