'use strict';
/*jshint ignore:start*/
exports.Wall = React.createClass({
  render: function () {
    return <div>Hello World!</div>;
  }
});

exports.render = function (parent) {
  var Wall = exports.Wall;
  React.renderComponent(<Wall />, parent);
};
