'use strict';
/*global React*/

var Input = bootstrap.Input,
    Button = bootstrap.Button,
    ButtonGroup = bootstrap.ButtonGroup,
    EntityDialog = require('./entity_dialog.jsx');

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
      <div className="canvas-menubar"
           style={this.state.style}>
        <EntityDialog/>
      </div>
    );
  }
});
