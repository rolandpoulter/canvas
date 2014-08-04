'use strict';
/*jshint ignore:start*/
exports.Wall = React.createClass({
  render: function () {
    return <div>Wall</div>;
  }
});

exports.render = function (parent) {
  var Wall = exports.Wall;
  return React.renderComponent(<Wall />, parent);
};
