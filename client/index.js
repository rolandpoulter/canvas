'use strict';
/*jshint ignore:start*/
var global = window;
/*jshint ignore:end*/

global.EventEmitter = require('events').EventEmitter;
global.jQuery = require('jquery');
global.React = require('react');

require('bootstrap/dist/js/bootstrap');

global.bootstrap = require('react-bootstrap');
global.events = new global.EventEmitter();

require('./app');
