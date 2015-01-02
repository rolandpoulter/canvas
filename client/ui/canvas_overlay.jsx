'use strict';
/*global React, window*/

var UserMenu = require('./user_menu.jsx'),
    CanvasToolbar = require('./canvas_toolbar.jsx'),
    CanvasMenubar = require('./canvas_menubar.jsx');

module.exports =
global.CanvasOverlay = React.createClass({
  getDefaultProps: function () {
    return {
    };
  },

  getInitialState: function () {
    var cornerstone_size = {
      x: 50,
      y: 50
    };
    return {
      overlay_style: {},
      conerstone_style: {
        width: cornerstone_size.x + 'px',
        height: cornerstone_size.y + 'px'
      },
      menubar_style: {
        left: cornerstone_size.x + 'px',
        width: (window.innerWidth - cornerstone_size.x) + 'px',
        height: cornerstone_size.y + 'px'
      },
      sidebar_style: {
        top: cornerstone_size.y + 'px',
        width: cornerstone_size.y + 'px',
        height: (window.innerHeight - cornerstone_size.x) + 'px'
      }
    };
  },

  render: function () {
    /*jshint white:false*/
    return (
      <div className="canvas-overlay"
           style={this.state.overlay_style}>
        <div className="wrap">
          <div className="cornerstone"
               style={this.state.conerstone_style}>
            <UserMenu/>
          </div>
          <div className="menubar"
               style={this.state.menubar_style}>
            <CanvasMenubar/>
          </div>
          <div className="sidebar"
               style={this.state.sidebar_style}>
            <CanvasToolbar/>
          </div>
          <div className="widgets"></div>
        </div>
      </div>
    );
  }
});
