'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Rectangle = require('./Rectangle');

var _Rectangle2 = _interopRequireDefault(_Rectangle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Viewport = function () {
  function Viewport(window) {
    var scroller = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;

    _classCallCheck(this, Viewport);

    this._scroller = scroller;
    this._window = window;
    this._programticScrollListeners = [];
    this._offsetTop = 0;
    this._useWindow = this._scroller === this._window;
  }

  _createClass(Viewport, [{
    key: '_getScrollerHeight',
    value: function _getScrollerHeight() {
      if (this._useWindow) {
        return Math.ceil(this._window.document.documentElement.clientHeight);
      }

      return this._scroller.clientHeight;
    }
  }, {
    key: '_addListener',
    value: function _addListener(event, listener, useWindow) {
      var target = useWindow ? this._window : this._scroller;

      var eventCallback = function eventCallback() {
        return listener();
      };

      target.addEventListener(event, eventCallback);

      return function () {
        target.removeEventListener(event, eventCallback);
      };
    }
  }, {
    key: 'setOffsetTop',
    value: function setOffsetTop(value) {
      this._offsetTop = value;
    }
  }, {
    key: 'getRect',
    value: function getRect() {
      var windowHeight = this._getScrollerHeight();
      var height = Math.max(0, windowHeight - this._offsetTop);
      return new _Rectangle2.default({ top: this._offsetTop, height: height });
    }

    // get scroll left

  }, {
    key: 'scrollX',
    value: function scrollX() {
      if (this._useWindow) {
        return -1 * this._window.document.body.getBoundingClientRect().left;
      }

      return this._scroller.scrollLeft;
    }

    // get scroll top

  }, {
    key: 'scrollY',
    value: function scrollY() {
      if (this._useWindow) {
        return -1 * this._window.document.body.getBoundingClientRect().top;
      }

      return this._scroller.scrollTop;
    }
  }, {
    key: 'scrollBy',
    value: function scrollBy(vertically) {
      if (this._useWindow) {
        this._window.scrollBy(0, vertically);
      } else {
        this._scroller.scrollTop += vertically;
      }

      this._programticScrollListeners.forEach(function (listener) {
        return listener(vertically);
      });
    }
  }, {
    key: 'addRectChangeListener',
    value: function addRectChangeListener(listener) {
      return this._addListener('resize', listener, true);
    }
  }, {
    key: 'addScrollListener',
    value: function addScrollListener(listener) {
      return this._addListener('scroll', listener, false);
    }

    // listener triggered by programmatic scroll

  }, {
    key: 'addProgrammaticScrollListener',
    value: function addProgrammaticScrollListener(listener) {
      var _this = this;

      if (this._programticScrollListeners.indexOf(listener) < 0) this._programticScrollListeners.push(listener);
      return function () {
        return _this.removeProgrammaticScrollListener(listener);
      };
    }
  }, {
    key: 'removeProgrammaticScrollListener',
    value: function removeProgrammaticScrollListener(listener) {
      var index = this._programticScrollListeners.indexOf(listener);
      if (index > -1) this._programticScrollListeners.splice(index, 1);
    }
  }]);

  return Viewport;
}();

exports.default = Viewport;