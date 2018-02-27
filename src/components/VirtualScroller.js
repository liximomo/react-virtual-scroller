import React from 'react';
import PropTypes from 'prop-types';

function getScrollTop(dom) {
  return dom.scrollTop;
}

class VirtualScroller extends React.PureComponent {
  static defaultProps = {
    bufferItemCount: 3,
    // string or func
    keySelector: 'id',
    items: [],
    averageHeight: 100,
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

    this.scrollTop = 0;
    this.cachedContainerMetric = {};
    this.itemsHeightById = {};
    this.itemsRefById = {};

    this.setRef = this.setRef.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  getItemHeight(item) {
    const id = this.getIdFromItem(item);
    return this.itemsHeightById[id] !== undefined
      ? this.itemsHeightById[id]
      : this.props.averageHeight;
  }

  getIdFromItem(item) {
    return item[this.props.keySelector];
  }

  calcItemHeight(item) {
    const id = this.getIdFromItem(item);
    const domFef = this.itemsRefById[id];
    this.itemsHeightById[id] = domFef.offsetHeight;
  }

  setItemRef(ref, item) {
    const id = this.getIdFromItem(item);
    this.itemsRefById[id] = ref;

    // cache item height
    if (this.itemsHeightById[id] === undefined) {
      this.calcItemHeight(item);
    }
  }

  setRef(ref) {
    this.containerDom = ref;
    if (this.props.setInnerRef) {
      this.props.setInnerRef(ref);
    }
  }

  createItemRenderProps(item) {
    const id = this.getIdFromItem(item);
    return {
      key: id,
      item,
      setRef: ref => this.setItemRef(ref, item),
      onHeightChange: () => this.calcItemHeight(item),
    };
  }

  cacheContainerInfo() {
    this.cachedContainerMetric.height = this.containerDom.clientHeight;
    this.scrollTop = getScrollTop(this.containerDom);
  }

  calcBeforeByItem(itemIndex, viewportStart, viewportEnd, accOffset) {
    const { items, bufferItemCount } = this.props;
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
    const { items, bufferItemCount } = this.props;

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

  updateProjection() {
    const { items } = this.props;

    const viewportStart = this.scrollTop;
    const viewportEnd = this.scrollTop + this.cachedContainerMetric.height;
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
    this.setState({
      beforePadding: before.padding,
      afterPadding: after.padding,
      renderedItems,
    });
  }

  handleScroll(event) {
    const target = event.currentTarget;
    this.scrollTop = getScrollTop(target);
    this.updateProjection();
  }

  componentDidMount() {
    this.cacheContainerInfo();
    this.updateProjection();
  }

  render() {
    const { renderedItems, beforePadding, afterPadding } = this.state;

    const { renderItem, style, cssClass } = this.props;

    return (
      <div ref={this.setRef} className={cssClass} style={style} onScroll={this.handleScroll}>
        <div style={{ height: beforePadding }} />
        {renderedItems.map(item => renderItem(this.createItemRenderProps(item)))}
        <div style={{ height: afterPadding }} />
      </div>
    );
  }
}

VirtualScroller.propTypes = {};

export default VirtualScroller;
