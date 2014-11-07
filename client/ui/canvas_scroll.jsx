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

    this.updateTileView();

    this.state = {
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

    this.setState(state);
  },

  updateTileView: function () {
    var bounds = this.props.view.worldBounds,
        tileSize = 256,
        scale = 1;

    // console.log('RESET', bounds);

    this.tiles.reset(bounds, tileSize, scale, function (cell) {
      /*jshint white:false*/
      if (!cell.ref) {
        cell.setRef(<CanvasTile
          // key={cell.key}
          hash={cell.hash}
          bounds={cell}
          scroll={this}
          tile_size={tileSize}
          initial_screen_x={cell.left}
          initial_screen_y={cell.top}/>);
      }

      // console.log(cell.left, cell.top);

      return cell;
    }.bind(this));

    // console.log('DONE', this.tiles.view.length);

    this.setState({
      tiles: this.tiles.view
    });
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

    // console.log('Tile count:', tiles.length);

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
