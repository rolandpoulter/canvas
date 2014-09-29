'use strict';/*global React*/

module.exports =
global.CanvasTile = React.createClass({
  getDefaultProps: function () {
    this.tileCache = [];
    return {
      key: null,
      hash: null,
      parent: null,
      tileSize: 512
    };
  },

  getInitialState: function () {
    return {
    };
  },

  render: function () {
    /*jshint white:false*/
    var hash = this.props.hash,
        tileSize = this.props.tileSize;
    var styles = {
      width: tileSize,
      height: tileSize,
      left: -(hash % 2) * tileSize,
      top: -Math.floor(hash / 2) * tileSize
    };
    return (
      <div className="canvas-tile" style={styles}>
        <canvas width={tileSize} height={tileSize}/>
      </div>
    );
  },

  intersectsWindow: function () {}
});
