'use strict';
/*jshint ignore:start*/
exports.CanvasWindow = React.createClass({
  render: function () {
    return <div>CanvasWindow</div>;
  }
});

exports.render = function (parent) {
  var CanvasWindow = exports.CanvasWindow;
  return React.renderComponent(<CanvasWindow />, parent);
};
