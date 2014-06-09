/*jshint ignore:start*/
'use strict';
exports.Main = React.createClass({
  render: function () {
    return <div>Hello World!</div>;
  }
});

exports.render = function (parent) {
  var Main = exports.Main;
  React.renderComponent(<Main />, parent);
};
