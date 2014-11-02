
(function(undefined) {

  var message = {};

  var _callback = {};
  var _data = {};
  var _hasData = {};


  /**
   * @param {String} module
   * @param {String} type
   * @param {Function} fn
   * @param {Boolean=} opt_once
   */
  function on(module, type, fn, opt_once) {
    if (_hasData[module] && _hasData[module][type]) {
      fn(_data[module] && _data[module][type]);
      if (opt_once) {
        return message;
      }
    }
    if (opt_once) {
      fn['_message_once'] = true;
    }
    _addCallback(module, type, fn); 
    return message;
  }

  /**
   * @param {String} module
   * @param {String} type
   * @param {*} opt_data 
   * @param {Boolean=} opt_cache
   */
  function post(module, type, opt_data, opt_cache) {
    _fireCallback(module, type, opt_data);
    if (opt_cache) {
      _setCacheData(module, type, opt_data);
    }
    return message;
  }

  /**
   * @param {String} module
   * @param {String} type
   * @param {Function} fn
   */
  function off(module, type, fn) {
    _removeCallback(module, type, fn);
    return message;
  }

  function _addCallback(module, type, fn) {
    if (!_callback[module]) {
      _callback[module] = {};
    }
    if (!_callback[module][type]) {
      _callback[module][type] = [];
    }
    _callback[module][type].push(fn);
  }

  function _setCacheData(module, type, data) {
    if (!_hasData[module]) {
      _hasData[module] = {};
    }
    _hasData[module][type] = true;
    //
    if (!_data[module]) {
      _data[module] = {};
    }
    _data[module][type] = data;
  }

  function _fireCallback(module, type, data) {
    if (_callback[module] && _callback[module][type]) {
      var callbacks = _callback[module][type];
      var len = callbacks.length;
      var onceCallbacks = [];
      var fn;
      for (var i = 0; i < len; i++) {
        fn = callbacks[i];
        fn(data);
        if (fn['_message_once']) {
          onceCallbacks.push(fn);
        }
      }
      var onceLen = onceCallbacks.length;
      for (var j = 0; j < onceLen; j++) {
        _removeCallback(module, type, onceCallbacks[j]);
      }
    }
  }

  function _removeCallback(module, type, fn) {
    if (_callback[module] && _callback[module][type]) {
      var callbacks = _callback[module][type].reverse();
      var len = callbacks.length;
      for (var i = 0; i < len; i++) {
        if (callbacks[i] === fn) {
          callbacks.splice(i, 1);
          if (fn['_message_once']) {
            fn['_message_once'] = undefined;
          }
        }
      }
    }
  }

  function _initBrowserEvent(e) {
    e.target = e.target || e.srcElement;
    if (typeof e.stopPropagation != 'function') {
      e.stopPropagation = function() {
        e.cancelBubble = true;
      };
    }
    if (typeof e.preventDefault != 'function') {
      e.preventDefault = function() {
        e.returnValue = false;    
      };
    }
    return e;
  }

  // export
  message.on = on;
  message.off = off;
  message.post = post;

  if (window['_handle']) {
    throw Error('_handle is defined.')
  }
  window['_handle'] = function(module, type, e) {
    post(module, type, _initBrowserEvent(e));
  };

  if (typeof define == 'function' && define.amd) {
    define(function() { return message; });
  } else {
    window['message'] = message;
  }

})();
