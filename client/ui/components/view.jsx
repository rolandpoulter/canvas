'use strict';
/*jshint ignore:start*/
exports.View = React.createClass({
  render: function () {
    return <div>Hello World!</div>;
  }
});

exports.render = function (parent) {
  var View = exports.View;
  React.renderComponent(<View />, parent);
};
