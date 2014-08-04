'use strict';
/*jshint ignore:start*/
exports.View = React.createClass({
  render: function () {
    return <div>View</div>;
  }
});

exports.render = function (parent) {
  var View = exports.View;
  return React.renderComponent(<View />, parent);
};
