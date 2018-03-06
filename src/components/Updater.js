import React from 'react';
import PropTypes from 'prop-types';
import recomputed from 'recomputed';
import throttle from 'lodash.throttle';
import List from './List';
import createScheduler from '../utlis/createScheduler';
import findIndex from '../utlis/findIndex';
import Rectangle from '../Rectangle';
import Viewport from '../Viewport';

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
    assumedItemHeight: 400,
    offscreenToViewportRatio: 1.8
  };

  state = {
    sliceStart: 0,
    sliceEnd: 0,
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
    this.state = this._getDefaultSlice(props.list, /* initItemIndex */);

    this._handleRefUpdate = this._handleRefUpdate.bind(this);
    this._update = this._update.bind(this);

    this._scheduleUpdate = createScheduler(this._update, window.requestAnimationFrame);
    this._handleScroll = throttle(this._scheduleUpdate, 100, { trailing: true });
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
    // var t = e.hasListChanged
    //   , n = this._recordHeights()
    //   , r = n.wasHeightChange
    //   , a = n.heightDelta;
    // if ((r || t) && this._prevPositioning) {
    //   (0,
    //   this.props.onHeightsUpdate)(this._prevPositioning, this.getPositioning())
    // }
    // (Math.abs(a) >= this._assumedItemHeight || t) && this._scheduleUpdate(),
    // this._schedulePositioningNotification()

    // $todo diff _heights -> this._scheduleUpdate
    this._recordHeights();
  }

  _getDefaultSlice(list, startIndex = 0) {
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
    let endIndex = findIndex(list.slice(startIndex), item => rects[item.id].getTop() - startOffset >= viewportHeight);
    endIndex = endIndex >= 0 ? endIndex + startIndex : list.length;

    return {
      sliceStart: startIndex,
      sliceEnd: endIndex,
    };
  }

  _computeBlankSpace() {
    const { list }= this.props;
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

  componentDidMount() {
    this._unlistenScroll = this.props.viewport.addScrollListener(this._handleScroll);
    this._postRenderProcessing();
  }

  // componentWillReceiveProps(nextProps) {
  //   // this._getDrivedProps(nextProps);
  // }

  componentDidUpdate() {
    this._postRenderProcessing();
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
    const { renderItem, cssClass, getHeightForDomNode } = this.props;

    return (
      <List
        ref={this._handleRefUpdate}
        list={this._getSlice()}
        blankSpaceAbove={blankSpaceAbove}
        blankSpaceBelow={blankSpaceBelow}
        renderItem={renderItem}
        getHeightForDomNode={getHeightForDomNode}
      />
    );
  }
}

export default Updater;
