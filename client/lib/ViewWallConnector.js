'use strict';
module.exports = ViewWallConnector;

function ViewWallConnector(view, wall) {
  if (view.wallConnector) {
    view.wallConnector.destroy();
  }
  view.wallConnector = this;
  view.currentWall = wall;
  wall.currentView = view;
}

ViewWallConnector.prototype.destroy = function () {
  // TODO:
};
