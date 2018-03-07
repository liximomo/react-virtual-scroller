"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isBetween(value, begin, end) {
  return value >= begin && value < end;
}

var Rectangle = function () {
  function Rectangle() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$top = _ref.top,
        top = _ref$top === undefined ? 0 : _ref$top,
        _ref$left = _ref.left,
        left = _ref$left === undefined ? 0 : _ref$left,
        _ref$height = _ref.height,
        height = _ref$height === undefined ? 0 : _ref$height,
        _ref$width = _ref.width,
        width = _ref$width === undefined ? 0 : _ref$width;

    _classCallCheck(this, Rectangle);

    this._top = top;
    this._left = left;
    this._height = height;
    this._width = width;
  }

  _createClass(Rectangle, [{
    key: "getTop",
    value: function getTop() {
      return this._top;
    }
  }, {
    key: "getBottom",
    value: function getBottom() {
      return this._top + this._height;
    }
  }, {
    key: "getLeft",
    value: function getLeft() {
      return this._left;
    }
  }, {
    key: "getRight",
    value: function getRight() {
      return this._left + this._width;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this._height;
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      return this._width;
    }
  }, {
    key: "doesIntersectWith",
    value: function doesIntersectWith(rect) {
      var top = this.getTop();
      var bottom = this.getBottom();
      var left = this.getLeft();
      var right = this.getRight();
      var aTop = rect.getTop();
      var aBottom = rect.getBottom();
      var aLeft = rect.getLeft();
      var aRight = rect.getRight();

      return isBetween(top, aTop, aBottom) || isBetween(aTop, top, bottom) || isBetween(left, aLeft, aRight) || isBetween(aLeft, left, right);
    }
  }, {
    key: "contains",
    value: function contains(point) {
      if (point.x === undefined) {
        return isBetween(point.y, this.getTop(), this.getBottom());
      } else if (point.y === undefined) {
        return isBetween(point.x, this.getLeft(), this.getRight());
      } else {
        return isBetween(point.y, this.getTop(), this.getBottom()) && isBetween(point.x, this.getLeft(), this.getRight());
      }
    }
  }, {
    key: "translateBy",
    value: function translateBy(x, y) {
      var left = this.getLeft();
      var top = this.getTop();

      if (x) {
        left += x;
      }

      if (y) {
        top += y;
      }

      return new Rectangle({
        left: left,
        top: top,
        width: this.getWidth(),
        height: this.getHeight()
      });
    }
  }]);

  return Rectangle;
}();

exports.default = Rectangle;