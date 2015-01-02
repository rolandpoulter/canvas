'use strict';
/*global React*/

module.exports =
global.UserMenu = React.createClass({
  getDefaultProps: function () {
    return {};
  },

  getInitialState: function () {
    return {
      style: {}
    };
  },

  render: function () {
    /*jshint white:false*/
    return (
      <div className="canvas-toolbar"
           style={this.state.style}>
      </div>
    );
  }
});
