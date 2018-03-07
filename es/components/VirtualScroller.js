var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import recomputed from 'recomputed';
import Updater from './Updater';
import Viewport from '../modules/Viewport';

var defaultIdentityFunction = function defaultIdentityFunction(a) {
  return a.id;
};

var VirtualScroller = function (_React$PureComponent) {
  _inherits(VirtualScroller, _React$PureComponent);

  function VirtualScroller(props) {
    _classCallCheck(this, VirtualScroller);

    /* eslint-disable no-shadow */
    var _this = _possibleConstructorReturn(this, (VirtualScroller.__proto__ || Object.getPrototypeOf(VirtualScroller)).call(this, props));

    _this._getList = recomputed(_this, function (props) {
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


      return React.createElement(Updater, {
        list: this._getList(),
        renderItem: renderItem,
        assumedItemHeight: assumedItemHeight,
        viewport: viewport
      });
    }
  }]);

  return VirtualScroller;
}(React.PureComponent);

VirtualScroller.defaultProps = {
  identityFunction: defaultIdentityFunction,
  offscreenToViewportRatio: 1.8,
  assumedItemHeight: 400
};


export default VirtualScroller;