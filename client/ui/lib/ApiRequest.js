'use strict';

module.exports = global.ApiRequest = ApiRequest;

function ApiRequest(mixin, callback) {
  /*jshint maxstatements:20, maxcomplexity:15*/
  if (this === global)
    throw new SyntaxError(ApiRequest.name + ' invoked without "new" prefix.');

  if (typeof mixin === 'string') mixin = {url: mixin};
  if (!mixin || !mixin.url || typeof mixin.url !== 'string')
    throw new TypeError(ApiRequest.name + ' url must be a truthy string.');

  var apiRequest = this,
      xhr = new this.XMLHttpRequest(),
      url = mixin.url;

  if (typeof mixin.respnoseType === 'string')
    this.reponseType = mixin.responseType;

  if (typeof callback === 'function') this.callback = callback;
  if (typeof mixin.onload === 'function') this.onload = mixin.onload;
  if (typeof mixin.error === 'function') this.error = mixin.error;

  xhr.reponseType = this.responseType;

  function apiRequest_onload(event) {
    /*jshint validthis:true*/
    var xhr = this;

    apiRequest.onload.call(xhr,
      event, apiRequest);

    apiRequest.callback.call(xhr,
      null, event, apiRequest);
  }

  function apiRequest_onerror(event) {
    /*jshint validthis:true*/
    var xhr = this;
    apiRequest.onerror.call(xhr,
      event, apiRequest);

    apiRequest.callback.call(xhr,
      null, event, apiRequest);
  }

  xhr.onload = apiRequest_onload;
  xhr.onerror = apiRequest_onerror;

  if (typeof mixin.method === 'string') this.method = mixin.method;
  if (mixin.isAsync === false) this.isAsync = false;

  xhr.open(this.method, url, this.isAsync);

  if (typeof mixin.beforeSend === 'function')
    this.beforeSend = mixin.beforeSend;

  this.beforeSend(xhr);
  xhr.send(this.payload);
}

ApiRequest.prototype.XMLHttpRequest = global.XMLHttpRequest;

ApiRequest.prototype.method = 'text';

ApiRequest.prototype.isAsync = true;

ApiRequest.prototype.autoUnlink = true;

ApiRequest.prototype.autoUnlinkDelay = 1000 / 60;

ApiRequest.prototype.responseType = 'text';

ApiRequest.prototype.payload = null;

/*jshint unused:false*/
ApiRequest.prototype.beforeSend = function (xhr) {};

// this context will be xhr for the following:
ApiRequest.prototype.callback =
  function (isError, event, apiRequest) {/*xhr context*/};
ApiRequest.prototype.onload = function (event, apiRequest) {/*xhr context*/};
ApiRequest.prototype.onerror = function (event, apiRequest) {/*xhr context*/};
