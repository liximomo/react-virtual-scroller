'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Rectangle = require('./Rectangle');

var _Rectangle2 = _interopRequireDefault(_Rectangle);

var _findIndex = require('../utlis/findIndex');

var _findIndex2 = _interopRequireDefault(_findIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Position = function () {
  function Position(_ref) {
    var viewportRectangle = _ref.viewportRectangle,
        list = _ref.list,
        rectangles = _ref.rectangles,
        sliceStart = _ref.sliceStart,
        sliceEnd = _ref.sliceEnd;

    _classCallCheck(this, Position);

    this._viewportRectangle = viewportRectangle;
    this._list = list;
    this._rectangles = rectangles;
    this._sliceStart = sliceStart;
    this._sliceEnd = sliceEnd;
  }

  _createClass(Position, [{
    key: 'getViewportRect',
    value: function getViewportRect() {
      return this._viewportRectangle;
    }
  }, {
    key: 'getListRect',
    value: function getListRect() {
      var list = this._list;
      if (list.length <= 0) {
        return new _Rectangle2.default({
          top: 0,
          height: 0
        });
      }
      return this._viewportRectangle;
    }
  }, {
    key: 'getAllItems',
    value: function getAllItems() {
      var _this = this;

      return this._list.map(function (item) {
        var id = item.id;
        return {
          id: id,
          rectangle: _this._rectangles[id]
        };
      });
    }
  }, {
    key: 'getList',
    value: function getList() {
      return this._list;
    }
  }, {
    key: 'getItemRect',
    value: function getItemRect(id) {
      return this._rectangles[id];
    }
  }, {
    key: 'findVisibleItems',
    value: function findVisibleItems() {
      var _this2 = this;

      var viewportRectangle = this._viewportRectangle;
      var rectangles = this._rectangles;
      var list = this._list;
      var startIndex = (0, _findIndex2.default)(list, function (item) {
        var id = item.id;
        return rectangles[id].doesIntersectWith(viewportRectangle);
      });
      if (startIndex < 0) {
        return [];
      }

      var endIndex = (0, _findIndex2.default)(list, function (item) {
        var id = item.id;
        return !rectangles[id].doesIntersectWith(viewportRectangle);
      }, startIndex);
      if (endIndex < 0) {
        endIndex = list.length;
      }

      return list.slice(startIndex, endIndex).filter(function (item) {
        var id = item.id;
        return _this2.isRendered(id);
      }).map(function (item) {
        var id = item.id;
        return {
          id: id,
          rectangle: rectangles[id]
        };
      });
    }
  }, {
    key: 'getRenderedItems',
    value: function getRenderedItems() {
      var rectangles = this._rectangles;
      return this._list.slice(this._sliceStart, this._sliceEnd).map(function (item) {
        var id = item.id;
        return {
          id: id,
          rectangle: rectangles[id]
        };
      });
    }
  }, {
    key: 'isRendered',
    value: function isRendered(id) {
      return this._getRenderedIdSet().hasOwnProperty(id);
    }
  }, {
    key: '_getRenderedIdSet',
    value: function _getRenderedIdSet() {
      if (!this._renderedIdSet) {
        this._renderedIdSet = {};
        for (var t = this._sliceStart; t < this._sliceEnd; t++) {
          this._renderedIdSet[this._list[t].id] = true;
        }
      }

      return this._renderedIdSet;
    }
  }]);

  return Position;
}();

exports.default = Position;