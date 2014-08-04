'use strict';
exports.create = function (app) {
  app.get('/config', function (req, res) {
    res.json(app.config.webclient);
  });
};
