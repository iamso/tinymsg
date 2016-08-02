/*!
 * tiny-msg-client - Version 0.2.0
 * client for tiny real-time messaging server
 * Author: Steve Ottoz <so@dev.so>
 * Build date: 2016-08-02
 * Copyright (c) 2016 Steve Ottoz
 * Released under the MIT license
 */

;(function (root, factory) {
  'use strict';

  if (/^f/.test(typeof define) && define.amd) {
    define('msg', [], factory);
  }
  else if (/^o/.test(typeof exports)) {
    module.exports = factory();
  }
  else {
    root.Msg = factory();
  }
})(!/^u/.test(typeof window) ? window : this, function() {
  'use strict';

  /**
   * Msg constructor
   * @param  {String}   channel - channel to join
   * @param  {Function} onmsg   - onmessage handler
   * @param  {Function} onerror - onerror handler
   * @param  {Object}   context - context for event handlers
   * @return {Object}           - Msg instance
   */
  var Msg = function(channel, onmsg, onerror, context) {
    this.url = '<%=url%>';
    this.channel = channel;
    this.onmsg = onmsg;
    this.onerror = onerror;
    this.context = context || this;
    this.q = [];
    this._init();
  };

  /**
   * Msg prototype
   * @type {Object}
   */
  Msg.prototype = {

    /**
     * _init function
     * Initialize the websocket
     */
    _init: function() {
      // return if WebSocket is not supported
      if (!WebSocket) {
        return;
      }
      var _this = this;
      _this.ws = new WebSocket(_this.url, _this.channel);
      _this.ws.onopen = _this._open.bind(_this);
      _this.ws.onmessage = _this._message.bind(_this);
      _this.ws.onerror = _this._error.bind(_this);
      _this.ws.onclose = _this._close.bind(_this);
    },

    /**
     * _open function
     * Internal onopen handler
     * @param  {Object} e - event
     */
    _open: function(e) {
      var _this = this;
      while(_this.q.length) {
        try {
          _this.ws.send(_this.q.shift());
        }
        catch(e) {}
      }
    },

    /**
     * _message function
     * Internal onmessage handler
     * @param  {Object} e - event
     */
    _message: function(e) {
      var data = e.data;
      try {
        data = JSON.parse(data);
      }
      catch(e) {}
      /^f/.test(typeof this.onmsg) && this.onmsg.apply(this.context, [data, e, this]);
    },

    /**
     * _error function
     * Internal onerror handler
     * @param  {Object} e - event
     */
    _error: function(e) {
      /^f/.test(typeof this.onerror) && this.onerror.apply(this.context, [e, this]);
    },

    /**
     * _close function
     * Internal onclose handler
     * @param  {Object} e - event
     */
    _close: function(e) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this._init.bind(this), 5000);
    },

    /**
     * send function
     * Exposed send function
     * @param  {Object|String} data - data to send
     */
    send: function(data) {
      try {
        data = JSON.stringify(data);
      }
      catch(e) {}
      if (this.ws.readyState === 1) {
        try {
          this.ws.send(data);
        }
        catch(e) {
          this.q.push(data);
        }
      }
      else {
        this.q.push(data);
      }
    },
  };

  /**
   * Return Msg
   * @type {Object}
   */
  return Msg;

});
