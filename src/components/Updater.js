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
  const viewportRect = prevPos.getViewportRect();

  const findBest = (list, comparator) => {
    if (list.length <= 0) {
      return null;
    }

    return list.reduce((best, item) => {
      return comparator(item, best) > 0 ? item : best;
    });
  };

  const inViewport = rect => rect && rect.doesIntersectWith(viewportRect);

  const distanceToViewportTop = rect =>
    rect ? Math.abs(viewportRect.getTop() - rect.getTop()) : 1 / 0;

  const boolCompartor = (getValue, a, b) => {
    const aResult = getValue(a);
    const bResult = getValue(b);
    if (aResult && !bResult) {
      return 1;
    } else if (!aResult && bResult) {
      return -1;
    } else {
      return 0;
    }
  };

  const numberCompartor = (getValue, a, b) => {
    const aResult = getValue(a);
    const bResult = getValue(b);
    return bResult - aResult;
  };

  const bothRendered = nextPos.getList().filter(item => {
    const id = item.id;
    return prevPos.isRendered(id) && nextPos.isRendered(id);
  });

  if (bothRendered.length <= 0) {
    return null;
  }

  const theBest = findBest(bothRendered, (current, best) => {
    const item = prevPos.getItemRect(current.id);
    const bestItem = prevPos.getItemRect(best.id);
    return (
      boolCompartor(inViewport, item, bestItem) ||
      numberCompartor(distanceToViewportTop, item, bestItem)
    );
  });

  return theBest;
}

function offsetCorrection(prevPos, nextPos) {
  const anchor = findAnchor(prevPos, nextPos);
  if (!anchor) {
    return 0;
  }

  const anchorId = anchor.id;
  const offsetToViewport = prevPos.getItemRect(anchorId).getTop() - prevPos.getViewportRect().getTop();
  return nextPos.getItemRect(anchorId).getTop() - nextPos.getViewportRect().getTop() - offsetToViewport;
}

function collectRect(list, heights, defaultHeight) {
  const rects = {};
  let top = 0;
  list.forEach(item => {
    const id = item.id;
    const height = heights[id] !== undefined ? heights[id] : defaultHeight;
    rects[id] = new Rectangle({
      top,
      height,
    });

    // eslint-disable-next-line no-param-reassign
    top += height;
  });

  return rects;
}

class Updater extends React.PureComponent {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.any).isRequired,
    renderItem: PropTypes.func.isRequired,
    viewport: PropTypes.instanceOf(Viewport).isRequired,
    assumedItemHeight: PropTypes.number,
    offscreenToViewportRatio: PropTypes.number,
  };

  static defaultProps = {
    offscreenToViewportRatio: 1.8,
    assumedItemHeight: 400,

  };

  constructor(props) {
    super(props);

    this._heights = {};

    /* eslint-disable no-shadow */
    this._getRectangles = recomputed(
      this,
      props => props.list,
      (_, __, obj) => obj._heights,
      props => props.assumedItemHeight,
      collectRect
    );

    this._getSlice = recomputed(
      this,
      props => props.list,
      (_, state) => state.sliceStart,
      (_, state) => state.sliceEnd,
      (list, sliceStart, sliceEnd) => list.slice(sliceStart, sliceEnd)
    );
    /* eslint-enable no-shadow */

    // $todo add initItemIndex props
    this.state = this._getDefaultSlice(props.list);

    this._handleRefUpdate = this._handleRefUpdate.bind(this);
    this._update = this._update.bind(this);

    this._scheduleUpdate = createScheduler(this._update, window.requestAnimationFrame);
    this._handleScroll = throttle(this._scheduleUpdate, 100, { trailing: true });
  }

  _handleRefUpdate(ref) {
    this._listRef = ref;
  }

  _onHeightsUpdate(prevPostion, nextPostion) {
    this.props.viewport.scrollBy(offsetCorrection(prevPostion, nextPostion));
  }

  _recordHeights() {
    if (!this._listRef) {
      return {
        heightDelta: 0,
      };
    }

    const itemHeights = this._listRef.getItemHeights();

    const heightDelta = Object.keys(itemHeights).reduce((accHeight, key) => {
      const itemHeight = this._heights.hasOwnProperty(key)
        ? this._heights[key]
        : this.props.assumedItemHeight;
      return accHeight + itemHeights[key] - itemHeight;
    }, 0);

    if (heightDelta !== 0) {
      this._heights = Object.assign({}, this._heights, itemHeights);
    }

    return {
      heightDelta,
    };
  }

  _postRenderProcessing(hasListChanged) {
    const heightState = this._recordHeights();
    const wasHeightChange = heightState.heightDelta !== 0;
    if ((hasListChanged || wasHeightChange) && this._prevPositioning) {
      this._onHeightsUpdate(this._prevPositioning, this.getPositioning());
    }

    if (hasListChanged || Math.abs(heightState.heightDelta) >= this.props.assumedItemHeight) {
      this._scheduleUpdate();
    }
  }

  _getDefaultSlice(list) {
    const startIndex = 0;
    const withNewList = {
      ...this,
      props: {
        ...this.props,
        list,
      },
    };

    const viewport = this.props.viewport;
    const viewportHeight = viewport.getRect().getHeight();
    const rects = this._getRectangles(withNewList);

    const startId = list[startIndex].id;
    const startOffset = rects[startId].getTop();
    let endIndex = findIndex(
      list,
      item => rects[item.id].getTop() - startOffset >= viewportHeight,
      startIndex
    );
    if (endIndex < 0) {
      endIndex = list.length;
    }

    return {
      sliceStart: startIndex,
      sliceEnd: endIndex,
    };
  }

  _computeBlankSpace() {
    const { list } = this.props;
    const { sliceStart, sliceEnd } = this.state;
    const rects = this._getRectangles();
    const lastIndex = list.length - 1;
    return {
      blankSpaceAbove:
        list.length <= 0 ? 0 : rects[list[sliceStart].id].getTop() - rects[list[0].id].getTop(),
      blankSpaceBelow:
        sliceEnd >= list.length
          ? 0
          : rects[list[lastIndex].id].getBottom() - rects[list[sliceEnd].id].getTop(),
    };
  }

  _getRelativeViewportRect() {
    if (!this._listRef) {
      return new Rectangle({ top: 0, height: 0 });
    }

    const listNode = this._listRef.getWrapperNode();
    const offsetTop = Math.ceil(listNode.getBoundingClientRect().top);
    return this.props.viewport.getRect().translateBy(0, -offsetTop);
  }

  _update() {
    const { list } = this.props;

    if (this._unmounted || 0 === list.length) {
      return;
    }

    const viewportRect = this._getRelativeViewportRect();
    const offscreenHeight = viewportRect.getHeight() * this.props.offscreenToViewportRatio;
    const renderRectTop = viewportRect.getTop() - offscreenHeight;
    const renderRectBottom = viewportRect.getBottom() + offscreenHeight;

    const rects = this._getRectangles();

    let startIndex = findIndex(list, item => rects[item.id].getBottom() > renderRectTop);
    if (startIndex < 0) {
      startIndex = list.length - 1;
    }

    let endIndex = findIndex(list, item => rects[item.id].getTop() >= renderRectBottom, startIndex);
    if (endIndex < 0) {
      endIndex = list.length;
    }

    this._setSlice(startIndex, endIndex);
  }

  _setSlice(start, end) {
    const { sliceStart, sliceEnd } = this.state;

    if (sliceStart !== start || sliceEnd !== end) {
      this.setState({
        sliceStart: start,
        sliceEnd: end,
      });
    }
  }

  getPositioning() {
    const { sliceStart, sliceEnd } = this.state;
    return new Position({
      viewportRectangle: this._getRelativeViewportRect(),
      list: this.props.list,
      rectangles: this._getRectangles(),
      sliceStart,
      sliceEnd,
    });
  }

  componentDidMount() {
    this._unlistenScroll = this.props.viewport.addScrollListener(this._handleScroll);
    this._postRenderProcessing(true);
  }

  componentWillReceiveProps(nextProps) {
    const prevList = this.props.list;
    const prevState = this.state;
    const nextList = nextProps.list;
    if (prevList !== nextList) {
      const slice =
        findNewSlice(prevList, nextList, prevState.sliceStart, prevState.sliceEnd) ||
        this._getDefaultSlice(nextList);
      this._setSlice(slice.sliceStart, slice.sliceEnd);
    }
  }

  componentWillUpdate() {
    this._prevPositioning = this.getPositioning();
  }

  componentDidUpdate(prevProps) {
    this._postRenderProcessing(prevProps.list !== this.props.list);
  }

  componentWillUnmount() {
    this._unmounted = true;

    if (this._unlistenScroll) {
      this._unlistenScroll();
    }
  }

  render() {
    const { blankSpaceAbove, blankSpaceBelow } = this._computeBlankSpace();

    // eslint-disable-next-line
    const { renderItem } = this.props;

    return (
      <List
        ref={this._handleRefUpdate}
        list={this._getSlice()}
        blankSpaceAbove={blankSpaceAbove}
        blankSpaceBelow={blankSpaceBelow}
        renderItem={renderItem}
      />
    );
  }
}

export default Updater;
