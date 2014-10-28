'use strict';

console.log('\n====================================' +
            '\n Boot-strapping test environment...');

exports.requireClient = requireClient;

var path = require('path');

global.requireClient = requireClient;

function requireClient(relPath) {
  return require(path.join(__dirname, '..',  '..', relPath));
}

requireClient.requireClient = requireClient;

global.mocha =  require('mocha');
global.sinon =  require('sinon');
global.chai =   require('chai');
global.chai.use(require('sinon-chai'));
global.chai.should();
