var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import recomputed from 'recomputed';
import throttle from 'lodash.throttle';
import List from './List';
import createScheduler from '../utlis/createScheduler';
import findIndex from '../utlis/findIndex';
import findNewSlice from '../utlis/findNewSlice';
import Position from '../modules/Position';
import Rectangle from '../modules/Rectangle';
import Viewport from '../modules/Viewport';

function findAnchor(prevPos, nextPos) {
  var viewportRect = prevPos.getViewportRect();

  var findBest = function findBest(list, comparator) {
    if (list.length <= 0) {
      return null;
    }

    return list.reduce(function (best, item) {
      return comparator(item, best) > 0 ? item : best;
    });
  };

  var inViewport = function inViewport(rect) {
    return rect && rect.doesIntersectWith(viewportRect);
  };

  var distanceToViewportTop = function distanceToViewportTop(rect) {
    return rect ? Math.abs(viewportRect.getTop() - rect.getTop()) : 1 / 0;
  };

  var boolCompartor = function boolCompartor(getValue, a, b) {
    var aResult = getValue(a);
    var bResult = getValue(b);
    if (aResult && !bResult) {
      return 1;
    } else if (!aResult && bResult) {
      return -1;
    } else {
      return 0;
    }
  };

  var numberCompartor = function numberCompartor(getValue, a, b) {
    var aResult = getValue(a);
    var bResult = getValue(b);
    return bResult - aResult;
  };

  var bothRendered = nextPos.getList().filter(function (item) {
    var id = item.id;
    return prevPos.isRendered(id) && nextPos.isRendered(id);
  });

  if (bothRendered.length <= 0) {
    return null;
  }

  var theBest = findBest(bothRendered, function (current, best) {
    var item = prevPos.getItemRect(current.id);
    var bestItem = prevPos.getItemRect(best.id);
    return boolCompartor(inViewport, item, bestItem) || numberCompartor(distanceToViewportTop, item, bestItem);
  });

  return theBest;
}

function offsetCorrection(prevPos, nextPos) {
  var anchor = findAnchor(prevPos, nextPos);
  if (!anchor) {
    return 0;
  }

  var anchorId = anchor.id;
  var offsetToViewport = prevPos.getItemRect(anchorId).getTop() - prevPos.getViewportRect().getTop();
  return nextPos.getItemRect(anchorId).getTop() - nextPos.getViewportRect().getTop() - offsetToViewport;
}

function collectRect(list, heights, defaultHeight) {
  var rects = {};
  var top = 0;
  list.forEach(function (item) {
    var id = item.id;
    var height = heights[id] !== undefined ? heights[id] : defaultHeight;
    rects[id] = new Rectangle({
      top: top,
      height: height
    });

    // eslint-disable-next-line no-param-reassign
    top += height;
  });

  return rects;
}

var Updater = function (_React$PureComponent) {
  _inherits(Updater, _React$PureComponent);

  function Updater(props) {
    _classCallCheck(this, Updater);

    var _this = _possibleConstructorReturn(this, (Updater.__proto__ || Object.getPrototypeOf(Updater)).call(this, props));

    _this._heights = {};

    /* eslint-disable no-shadow */
    _this._getRectangles = recomputed(_this, function (props) {
      return props.list;
    }, function (_, __, obj) {
      return obj._heights;
    }, function (props) {
      return props.assumedItemHeight;
    }, collectRect);

    _this._getSlice = recomputed(_this, function (props) {
      return props.list;
    }, function (_, state) {
      return state.sliceStart;
    }, function (_, state) {
      return state.sliceEnd;
    }, function (list, sliceStart, sliceEnd) {
      return list.slice(sliceStart, sliceEnd);
    });
    /* eslint-enable no-shadow */

    // $todo add initItemIndex props
    _this.state = _this._getDefaultSlice(props.list);

    _this._handleRefUpdate = _this._handleRefUpdate.bind(_this);
    _this._update = _this._update.bind(_this);

    _this._scheduleUpdate = createScheduler(_this._update, window.requestAnimationFrame);
    _this._handleScroll = throttle(_this._scheduleUpdate, 100, { trailing: true });
    return _this;
  }

  _createClass(Updater, [{
    key: '_handleRefUpdate',
    value: function _handleRefUpdate(ref) {
      this._listRef = ref;
    }
  }, {
    key: '_onHeightsUpdate',
    value: function _onHeightsUpdate(prevPostion, nextPostion) {
      this.props.viewport.scrollBy(offsetCorrection(prevPostion, nextPostion));
    }
  }, {
    key: '_recordHeights',
    value: function _recordHeights() {
      var _this2 = this;

      if (!this._listRef) {
        return {
          heightDelta: 0
        };
      }

      var itemHeights = this._listRef.getItemHeights();

      var heightDelta = Object.keys(itemHeights).reduce(function (accHeight, key) {
        var itemHeight = _this2._heights.hasOwnProperty(key) ? _this2._heights[key] : _this2.props.assumedItemHeight;
        return accHeight + itemHeights[key] - itemHeight;
      }, 0);

      if (heightDelta !== 0) {
        this._heights = Object.assign({}, this._heights, itemHeights);
      }

      return {
        heightDelta: heightDelta
      };
    }
  }, {
    key: '_postRenderProcessing',
    value: function _postRenderProcessing(hasListChanged) {
      var heightState = this._recordHeights();
      var wasHeightChange = heightState.heightDelta !== 0;
      if ((hasListChanged || wasHeightChange) && this._prevPositioning) {
        this._onHeightsUpdate(this._prevPositioning, this.getPositioning());
      }

      if (hasListChanged || Math.abs(heightState.heightDelta) >= this.props.assumedItemHeight) {
        this._scheduleUpdate();
      }
    }
  }, {
    key: '_getDefaultSlice',
    value: function _getDefaultSlice(list) {
      var startIndex = 0;
      var withNewList = Object.assign({}, this, {
        props: Object.assign({}, this.props, {
          list: list
        })
      });

      var viewport = this.props.viewport;
      var viewportHeight = viewport.getRect().getHeight();
      var rects = this._getRectangles(withNewList);

      var startId = list[startIndex].id;
      var startOffset = rects[startId].getTop();
      var endIndex = findIndex(list, function (item) {
        return rects[item.id].getTop() - startOffset >= viewportHeight;
      }, startIndex);
      if (endIndex < 0) {
        endIndex = list.length;
      }

      return {
        sliceStart: startIndex,
        sliceEnd: endIndex
      };
    }
  }, {
    key: '_computeBlankSpace',
    value: function _computeBlankSpace() {
      var list = this.props.list;
      var _state = this.state,
          sliceStart = _state.sliceStart,
          sliceEnd = _state.sliceEnd;

      var rects = this._getRectangles();
      var lastIndex = list.length - 1;
      return {
        blankSpaceAbove: list.length <= 0 ? 0 : rects[list[sliceStart].id].getTop() - rects[list[0].id].getTop(),
        blankSpaceBelow: sliceEnd >= list.length ? 0 : rects[list[lastIndex].id].getBottom() - rects[list[sliceEnd].id].getTop()
      };
    }
  }, {
    key: '_getRelativeViewportRect',
    value: function _getRelativeViewportRect() {
      if (!this._listRef) {
        return new Rectangle({ top: 0, height: 0 });
      }

      var listNode = this._listRef.getWrapperNode();
      var offsetTop = Math.ceil(listNode.getBoundingClientRect().top);
      return this.props.viewport.getRect().translateBy(0, -offsetTop);
    }
  }, {
    key: '_update',
    value: function _update() {
      var list = this.props.list;


      if (this._unmounted || 0 === list.length) {
        return;
      }

      var viewportRect = this._getRelativeViewportRect();
      var offscreenHeight = viewportRect.getHeight() * this.props.offscreenToViewportRatio;
      var renderRectTop = viewportRect.getTop() - offscreenHeight;
      var renderRectBottom = viewportRect.getBottom() + offscreenHeight;

      var rects = this._getRectangles();

      var startIndex = findIndex(list, function (item) {
        return rects[item.id].getBottom() > renderRectTop;
      });
      if (startIndex < 0) {
        startIndex = list.length - 1;
      }

      var endIndex = findIndex(list, function (item) {
        return rects[item.id].getTop() >= renderRectBottom;
      }, startIndex);
      if (endIndex < 0) {
        endIndex = list.length;
      }

      this._setSlice(startIndex, endIndex);
    }
  }, {
    key: '_setSlice',
    value: function _setSlice(start, end) {
      var _state2 = this.state,
          sliceStart = _state2.sliceStart,
          sliceEnd = _state2.sliceEnd;


      if (sliceStart !== start || sliceEnd !== end) {
        this.setState({
          sliceStart: start,
          sliceEnd: end
        });
      }
    }
  }, {
    key: 'getPositioning',
    value: function getPositioning() {
      var _state3 = this.state,
          sliceStart = _state3.sliceStart,
          sliceEnd = _state3.sliceEnd;

      return new Position({
        viewportRectangle: this._getRelativeViewportRect(),
        list: this.props.list,
        rectangles: this._getRectangles(),
        sliceStart: sliceStart,
        sliceEnd: sliceEnd
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._unlistenScroll = this.props.viewport.addScrollListener(this._handleScroll);
      this._postRenderProcessing(true);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var prevList = this.props.list;
      var prevState = this.state;
      var nextList = nextProps.list;
      if (prevList !== nextList) {
        var slice = findNewSlice(prevList, nextList, prevState.sliceStart, prevState.sliceEnd) || this._getDefaultSlice(nextList);
        this._setSlice(slice.sliceStart, slice.sliceEnd);
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      this._prevPositioning = this.getPositioning();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this._postRenderProcessing(prevProps.list !== this.props.list);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;

      if (this._unlistenScroll) {
        this._unlistenScroll();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _computeBlankSpace2 = this._computeBlankSpace(),
          blankSpaceAbove = _computeBlankSpace2.blankSpaceAbove,
          blankSpaceBelow = _computeBlankSpace2.blankSpaceBelow;

      // eslint-disable-next-line


      var renderItem = this.props.renderItem;


      return React.createElement(List, {
        ref: this._handleRefUpdate,
        list: this._getSlice(),
        blankSpaceAbove: blankSpaceAbove,
        blankSpaceBelow: blankSpaceBelow,
        renderItem: renderItem
      });
    }
  }]);

  return Updater;
}(React.PureComponent);

Updater.defaultProps = {
  offscreenToViewportRatio: 1.8,
  assumedItemHeight: 400

};


export default Updater;