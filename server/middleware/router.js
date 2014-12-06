'use strict';

var kroute = require('kroute');

app.router = kroute();

app.base.use(app.router);
