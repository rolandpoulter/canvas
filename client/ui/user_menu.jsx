'use strict';
/*global React*/

var AuthDialog = require('./auth_dialog.jsx');

module.exports =
global.UserMenu = React.createClass({
  getDefaultProps: function () {
    return {
      initial_session: {}
    };
  },

  getInitialState: function () {
    return {
      session: this.props.initial_session,
      style: {}
    };
  },

  render: function () {
    /*jshint white:false*/
    return (
      <div className="user-menu"
           style={this.state.style}>
        <AuthDialog/>
      </div>
    );
  }
});
