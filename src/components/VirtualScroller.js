import React from 'react';
import PropTypes from 'prop-types';
import recomputed from 'recomputed';
import throttle from 'lodash.throttle';
import List from './List';
import createScheduler from '../utlis/createScheduler';
import Rectangle from '../utlis/Rectangle';

function findIndex(list, predictor) {
  for (let index = 0; index < list.length; index++) {
    if (predictor(list[index], index)) {
      return index;
    }
  }

  return -1;
}

function getScrollTop(dom) {
  return dom.scrollTop;
}

function getHeightForDomNode(node) {
  return node ? node.getBoundingClientRect().height : 0;
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

class VirtualScroller extends React.PureComponent {
  static defaultProps = {
    getHeightForDomNode,
    offscreenToViewportRatio: 1.8,
    bufferItemCount: 3,
    // string or func
    identityFunction: a => a.id,
    items: [],
    assumedItemHeight: 200,
    setInnerRef: () => null,
  };

  static propTypes = {
    offscreenToViewportRatio: PropTypes.number,
    renderItem: PropTypes.func.isRequired,
  };

  state = {
    sliceStart: 0,
    sliceEnd: 0,
  };

  constructor(props) {
    super(props);

    this._getDrivedProps(props);
    this._heights = {};

    this._getRectangles = recomputed(
      this,
      (_, __, obj) => obj.list,
      (_, __, obj) => obj._heights,
      // eslint-disable-next-line no-shadow
      props => props.assumedItemHeight,
      collectRect
    );

    this._getSlice = recomputed(
      this,
      (_, __, obj) => obj.list,
      (_, state) => state.sliceStart,
      (_, state) => state.sliceEnd,
      (list, sliceStart, sliceEnd) => list.slice(sliceStart, sliceEnd)
    );

    this.scrollTop = 0;
    this.cachedContainerMetric = {};
    this.scroller = null;
    this.setScroller = this.setScroller.bind(this);

    this._handleRefUpdate = this._handleRefUpdate.bind(this);
    this._update = this._update.bind(this);

    const updateScheduler = createScheduler(this._update, window.requestAnimationFrame);
    this._handleScroll = throttle(updateScheduler, 100, { trailing: true });
    this.handleResize = this.handleResize.bind(this);

    // anchor to keep scroll position stable
    this.anchor = null;
  }

  _handleRefUpdate(ref) {
    this._listRef = ref;
  }

  _recordHeights() {
    if (!this._listRef) {
      return;
    }

    const itemHeights = this._listRef.getItemHeights();

    this._heights = Object.assign({}, this._heights, itemHeights);
  }

  _postRenderProcessing() {
    this._recordHeights();
  }

  _getDrivedProps(props) {
    this.list = props.items.map(item => ({
      data: item,
      id: this.props.identityFunction(item),
    }));
  }

  setScroller(ref) {
    this.scroller = ref;
  }

  getItemHeight(item) {
    const id = item.id;
    return this._heights[id] !== undefined ? this._heights[id] : this.props.assumedItemHeight;
  }

  updateItemHeight(item, $element) {
    const id = item.id;
    this._heights[id] = this.props.getHeightForDomNode($element);
  }

  setItemRef(ref, item) {
    if (ref === null) {
      return;
    }

    this.updateItemHeight(item, ref);
  }

  createItemRenderProps(item) {
    const id = item.id;
    return {
      key: id,
      item,
      setRef: ref => {
        this.setItemRef(ref, item);
      },
    };
  }

  cacheContainerInfo() {
    this.cachedContainerMetric.height = this.scroller.clientHeight;
  }

  _computeBlankSpace() {
    const list = this.list;
    const {
      sliceStart,
      sliceEnd
    } = this.state;
    const rects = this._getRectangles();
    const lastIndex = list.length - 1;
    return {
      blankSpaceAbove: list.length <= 0 ? 0 : rects[list[sliceStart].id].getTop() - rects[list[0].id].getTop(),
      blankSpaceBelow: sliceEnd >= list.length ? 0 : rects[list[lastIndex].id].getBottom() - rects[list[sliceEnd].id].getTop(),
    };
  }

  _getRelativeViewportRect() {
    this.scrollTop = getScrollTop(this.scroller);
    return new Rectangle({
      top: this.scrollTop,
      height: this.cachedContainerMetric.height,
    });
  }

  _update() {
    const list = this.list;
    const viewportRect = this._getRelativeViewportRect();

    const offscreenHeight = viewportRect.getHeight() * this.props.offscreenToViewportRatio;
    const renderRectTop = viewportRect.getTop() - offscreenHeight;
    const renderRectBottom = viewportRect.getBottom() + offscreenHeight;

    // todo find first by iterating rects
    const rects = this._getRectangles();

    let startIndex = findIndex(list, item => rects[item.id].getBottom() > renderRectTop);
    if (startIndex < 0) {
      startIndex = list.length - 1;
    }
  
    let endIndex = findIndex(list.slice(startIndex), item => rects[item.id].getTop() >= renderRectBottom);
    endIndex = endIndex >= 0 ? startIndex + endIndex : list.length;

    this._setSlice(startIndex, endIndex);
  }

  _setSlice(start, end) {
    const {
      sliceStart,
      sliceEnd
    } = this.state;
  
    if (sliceStart !== start || sliceEnd !== end) {
      this.setState({
        sliceStart: start,
        sliceEnd: end,
      });
    }
  }

  handleResize() {
    // update container metric, it may changes.
    this.cacheContainerInfo();
  }

  componentDidMount() {
    this.cacheContainerInfo();
    this._update();

    this._postRenderProcessing();
    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillReceiveProps(nextProps) {
    this._getDrivedProps(nextProps);
  }

  componentDidUpdate() {
    this._postRenderProcessing();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  render() {
    const { blankSpaceAbove, blankSpaceBelow } = this._computeBlankSpace();

    // eslint-disable-next-line
    const { renderItem, cssClass, getHeightForDomNode } = this.props;

    return (
      <div ref={this.setScroller} className={cssClass} onScroll={this._handleScroll}>
        <List
          ref={this._handleRefUpdate}
          list={this._getSlice()}
          blankSpaceAbove={blankSpaceAbove}
          blankSpaceBelow={blankSpaceBelow}
          renderItem={renderItem}
          getHeightForDomNode={getHeightForDomNode}
        />
      </div>
    );
  }
}

export default VirtualScroller;
