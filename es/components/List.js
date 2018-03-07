var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';

var nullFunc = function nullFunc() {
  return null;
};

function defaultGetHeightForDomNode(node) {
  return node ? node.getBoundingClientRect().height : 0;
}

var List = function (_React$PureComponent) {
  _inherits(List, _React$PureComponent);

  function List(props) {
    _classCallCheck(this, List);

    var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

    _this._refs = {};
    _this._handleViewRefUpdate = _this._handleViewRefUpdate.bind(_this);
    return _this;
  }

  _createClass(List, [{
    key: '_handleViewRefUpdate',
    value: function _handleViewRefUpdate(ref) {
      this._view = ref;
    }
  }, {
    key: '_handleItemRefUpdate',
    value: function _handleItemRefUpdate(id, ref) {
      if (!ref) {
        delete this._refs[id];
      } else {
        this._refs[id] = ref;
      }
    }
  }, {
    key: '_renderContent',
    value: function _renderContent() {
      var _this2 = this;

      return this.props.list.map(function (item, index) {
        var id = item.id;
        var data = item.data;
        var reactElement = _this2.props.renderItem(data, index);
        var savedRefFunc = 'function' === typeof reactElement.ref ? reactElement.ref : nullFunc;
        return React.cloneElement(reactElement, {
          key: id,
          ref: function ref(r) {
            _this2._handleItemRefUpdate(id, r);
            savedRefFunc(r);
          }
        });
      });
    }
  }, {
    key: 'getWrapperNode',
    value: function getWrapperNode() {
      return this._view;
    }
  }, {
    key: 'getItemHeights',
    value: function getItemHeights() {
      var _this3 = this;

      var _props = this.props,
          list = _props.list,
          getHeightForDomNode = _props.getHeightForDomNode;


      return list.reduce(function (heightsMap, item) {
        var id = item.id;
        var node = _this3._refs[id];

        // eslint-disable-next-line no-param-reassign
        heightsMap[id] = getHeightForDomNode(node);
        return heightsMap;
      }, {});
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          blankSpaceAbove = _props2.blankSpaceAbove,
          blankSpaceBelow = _props2.blankSpaceBelow;


      return React.createElement(
        'div',
        {
          ref: this._handleViewRefUpdate,
          style: {
            paddingTop: blankSpaceAbove,
            paddingBottom: blankSpaceBelow
          },
          onScroll: this.handleScroll
        },
        this._renderContent()
      );
    }
  }]);

  return List;
}(React.PureComponent);

List.defaultProps = {
  getHeightForDomNode: defaultGetHeightForDomNode
};


export default List;