import React from 'react';
import PropTypes from 'prop-types';
import recomputed from 'recomputed';
import Updater from './Updater';
import Viewport from '../modules/Viewport';

const defaultIdentityFunction = a => a.id;

class VirtualScroller extends React.PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
    renderItem: PropTypes.func.isRequired,
    viewport: PropTypes.instanceOf(Viewport).isRequired,
    identityFunction: PropTypes.func,
    offscreenToViewportRatio: PropTypes.number,
    assumedItemHeight: PropTypes.number,
  };

  static defaultProps = {
    identityFunction: defaultIdentityFunction,
    offscreenToViewportRatio: 1.8,
    assumedItemHeight: 400,
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
    /* eslint-enable no-shadow */
  }

  render() {
    const { renderItem, assumedItemHeight, viewport } = this.props;

    return (
      <Updater
        list={this._getList()}
        renderItem={renderItem}
        assumedItemHeight={assumedItemHeight}
        viewport={viewport}
      />
    )
  }
}

export default VirtualScroller;
