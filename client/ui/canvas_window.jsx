'use strict';/*global React*/

var CanvasTile = require('./canvas_tile.jsx');

var CanvasWindow = React.createClass({
  render: function () {
    return <div>CanvasWindow
      <CanvasTile/>
      <CanvasTile/>
      <CanvasTile/>
      <CanvasTile/>
    </div>;
  }
});

module.exports = CanvasWindow;

CanvasWindow.safeRender = function (parent) {
  return React.renderComponent(<CanvasWindow/>, parent);
};
