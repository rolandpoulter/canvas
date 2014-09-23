'use strict';
/*jshint ignore:start*/
exports.CanvasTile = React.createClass({
  render: function () {
    return <div>CanvasTile</div>;
  }
});

exports.render = function (parent) {
  var CanvasTile = exports.CanvasTile;
  return React.renderComponent(<CanvasTile />, parent);
};
