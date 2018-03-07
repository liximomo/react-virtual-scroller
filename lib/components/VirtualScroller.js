'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _recomputed = require('recomputed');

var _recomputed2 = _interopRequireDefault(_recomputed);

var _Updater = require('./Updater');

var _Updater2 = _interopRequireDefault(_Updater);

var _Viewport = require('../modules/Viewport');

var _Viewport2 = _interopRequireDefault(_Viewport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultIdentityFunction = function defaultIdentityFunction(a) {
  return a.id;
};

var VirtualScroller = function (_React$PureComponent) {
  _inherits(VirtualScroller, _React$PureComponent);

  function VirtualScroller(props) {
    _classCallCheck(this, VirtualScroller);

    /* eslint-disable no-shadow */
    var _this = _possibleConstructorReturn(this, (VirtualScroller.__proto__ || Object.getPrototypeOf(VirtualScroller)).call(this, props));

    _this._getList = (0, _recomputed2.default)(_this, function (props) {
      return props.items;
    }, function (items) {
      var idMap = {};
      var resultList = [];

      items.forEach(function (item) {
        var id = _this.props.identityFunction(item);
        if (idMap.hasOwnProperty(id)) {
          // eslint-disable-next-line no-console
          console.warn('Duplicate item id generated in VirtualScroller. Latter item (id = "' + id + '") will be discarded');
          return;
        }

        resultList.push({
          id: id,
          data: item
        });
        idMap[id] = true;
      });

      return resultList;
    });
    /* eslint-enable no-shadow */
    return _this;
  }

  _createClass(VirtualScroller, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          renderItem = _props.renderItem,
          assumedItemHeight = _props.assumedItemHeight,
          viewport = _props.viewport;


      return _react2.default.createElement(_Updater2.default, {
        list: this._getList(),
        renderItem: renderItem,
        assumedItemHeight: assumedItemHeight,
        viewport: viewport
      });
    }
  }]);

  return VirtualScroller;
}(_react2.default.PureComponent);

VirtualScroller.defaultProps = {
  identityFunction: defaultIdentityFunction,
  offscreenToViewportRatio: 1.8,
  assumedItemHeight: 400
};
exports.default = VirtualScroller;