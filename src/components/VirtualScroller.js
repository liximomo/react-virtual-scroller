import React from 'react';
import PropTypes from 'prop-types';
import List from './List';

function getScrollTop(dom) {
  return dom.scrollTop;
}

function getHeightForDomNode(node) {
  return node ? node.getBoundingClientRect().height : 0
}

class VirtualScroller extends React.PureComponent {
  static defaultProps = {
    getHeightForDomNode,
    bufferItemCount: 3,
    // string or func
    identityFunction: a => a.id,
    items: [],
    assumedItemHeight: 100,
    setInnerRef: () => null,
  };

  static propTypes = {
    renderItem: PropTypes.func.isRequired,
  };

  state = {
    beforePadding: 0,
    afterPadding: 0,
    renderedItems: [],
  };

  constructor(props) {
    super(props);

    this._getDrivedProps(props);
    this.scrollTop = 0;
    this.cachedContainerMetric = {};
    this._heights = {};
    this.scroller = null;

    this._handleRefUpdate = this._handleRefUpdate.bind(this);
    this.setScroller = this.setScroller.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this._heights = {};
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
    return this._heights[id] !== undefined
      ? this._heights[id]
      : this.props.assumedItemHeight;
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
        this.setItemRef(ref, item)
      }
    };
  }

  cacheContainerInfo() {
    this.cachedContainerMetric.height = this.scroller.clientHeight;
  }

  calcBeforeByItem(itemIndex, viewportStart, viewportEnd, accOffset) {
    const { bufferItemCount } = this.props;
    const items = this.list;
    const item = items[itemIndex];
    const itemSpcace = this.getItemHeight(item);

    const inViewportHeight = accOffset - viewportStart;
    const outViewportHeight = itemSpcace - inViewportHeight;
    let padding = viewportStart - outViewportHeight;

    const bufferItems = items.slice(itemIndex - bufferItemCount, itemIndex);
    const bufferHeight = bufferItems.reduce((acc, bufferItem) => {
      // eslint-disable-next-line no-param-reassign
      acc = acc + this.getItemHeight(bufferItem);
      return acc;
    }, 0);

    padding -= bufferHeight;

    return {
      padding,
      items: [...bufferItems, item],
    };
  }

  calcAfterByItem(itemIndex, viewportStart, viewportEnd, accOffset) {
    const { bufferItemCount } = this.props;
    const items = this.list;
    const visibleItems = [];
    let lastItemIndex;
    for (let index = itemIndex + 1; index < items.length; index++) {
      const item = items[index];
      const itemSpcace = this.getItemHeight(item);
      // eslint-disable-next-line no-param-reassign
      accOffset += itemSpcace;
      visibleItems.push(item);

      if (accOffset >= viewportEnd) {
        lastItemIndex = index;
        break;
      }
    }

    let scrollHeight = accOffset;
    for (let index = lastItemIndex + 1; index < items.length; index++) {
      const item = items[index];
      const itemSpcace = this.getItemHeight(item);
      scrollHeight += itemSpcace;
    }

    let padding = scrollHeight - accOffset;
    const bufferItems = items.slice(lastItemIndex + 1, lastItemIndex + 1 + bufferItemCount);
    const bufferHeight = bufferItems.reduce((acc, bufferItem) => {
      // eslint-disable-next-line no-param-reassign
      acc = acc + this.getItemHeight(bufferItem);
      return acc;
    }, 0);

    padding -= bufferHeight;

    return {
      padding,
      items: [...visibleItems, ...bufferItems],
    };
  }

  calcProjection(items, viewportStart, viewportEnd) {
    let accOffset = 0;
    let indexOfFisrtItemInViewport;
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const itemSpcace = this.getItemHeight(item);
      accOffset += itemSpcace;

      if (accOffset > viewportStart) {
        // find fisrt item in viewport
        indexOfFisrtItemInViewport = index;
        break;
      }
    }

    const before = this.calcBeforeByItem(
      indexOfFisrtItemInViewport,
      viewportStart,
      viewportEnd,
      accOffset
    );
    const after = this.calcAfterByItem(
      indexOfFisrtItemInViewport,
      viewportStart,
      viewportEnd,
      accOffset
    );
    const renderedItems = [...before.items, ...after.items];
    
    return {
      beforePadding: before.padding,
      afterPadding: after.padding,
      renderedItems,
    };
  }

  updateProjection() {
    const viewportStart = this.scrollTop;
    const viewportEnd = this.scrollTop + this.cachedContainerMetric.height;

    this.setState(this.calcProjection(this.list, viewportStart, viewportEnd));
  }

  handleScroll() {
    this.scrollTop = getScrollTop(this.scroller);
    this.updateProjection();
  }

  handleResize() {
    // update container metric, it may changes.
    this.cacheContainerInfo();
  }

  componentDidMount() {
    this.cacheContainerInfo();
    this.updateProjection();

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
    const { beforePadding, afterPadding } = this.state;

    // eslint-disable-next-line
    const { renderItem, cssClass, getHeightForDomNode } = this.props;

    return (
      <div
        ref={this.setScroller}
        className={cssClass}
        onScroll={this.handleScroll}
      >
        <List
          ref={this._handleRefUpdate}
          list={this.state.renderedItems}
          blankSpaceAbove={beforePadding}
          blankSpaceBelow={afterPadding}
          renderItem={renderItem}
          getHeightForDomNode={getHeightForDomNode}
        />
      </div>
    );
  }
}

export default VirtualScroller;
