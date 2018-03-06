import React from 'react';
import PropTypes from 'prop-types';
import recomputed from 'recomputed';
import Updater from './Updater';
import Viewport from '../Viewport';

class VirtualScroller extends React.PureComponent {
  static defaultProps = {
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
    wrapperNode: null,
  };

  constructor(props) {
    super(props);

    /* eslint-disable no-shadow */
    this._getList = recomputed(
      this,
      props => props.items,
      items => {
        const idMap = {};
        const resultList = [];

        items.forEach(item => {
          const id = this.props.identityFunction(item);
          if (idMap.hasOwnProperty(id)) {
            // eslint-disable-next-line no-console
            console.warn(
              `Duplicate item id generated in VirtualScroller. Latter item (id = "${id}") will be discarded`
            );
            return;
          }

          resultList.push({
            id,
            data: item,
          });
          idMap[id] = true;
        });

        return resultList;
      }
    );

    this._getViewport = recomputed(
      this,
      (_, state) => state.wrapperNode,
      node => new Viewport(window, node)
    );
    /* eslint-enable no-shadow */

    this._receiveWrapperNode = this._receiveWrapperNode.bind(this);
  }

  _receiveWrapperNode(ref) {
    this.setState({
      wrapperNode: ref,
    });
  }

  render() {
    const { wrapperNode } = this.state;
    const { renderItem } = this.props;

    return (
      <div className="list" ref={this._receiveWrapperNode}>
        {wrapperNode ? (
          <Updater list={this._getList()} renderItem={renderItem} viewport={this._getViewport()} />
        ) : null}
      </div>
    );
  }
}

export default VirtualScroller;
