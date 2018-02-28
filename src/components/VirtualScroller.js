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

    this.setRef = this.setRef.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);

    // anchor to keep scroll position stable
    this.anchor = null;
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

  updateItemHeight(item, $element) {
    const id = this.getIdFromItem(item);
    this.itemsHeightById[id] = $element.offsetHeight;
  }

  setItemRef(ref, item) {
    if (ref === null) {
      return;
    }

    this.updateItemHeight(item, ref);
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
      setRef: ref => {
        this.setItemRef(ref, item)
      }
    };
  }

  cacheContainerInfo() {
    this.cachedContainerMetric.height = this.containerDom.clientHeight;
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

    this.setState(this.calcProjection(this.props.items, viewportStart, viewportEnd));
  }

  handleScroll(event) {
    const target = event.currentTarget;
    this.scrollTop = getScrollTop(target);
    this.updateProjection();
  }

  handleResize() {
    // update container metric, it may changes.
    this.cacheContainerInfo();
  }

  componentDidMount() {
    this.cacheContainerInfo();
    this.updateProjection();

    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillMount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  componentDidUpdate() {
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
