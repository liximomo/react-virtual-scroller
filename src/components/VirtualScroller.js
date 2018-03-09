import React from 'react';
import PropTypes from 'prop-types';
import recomputed from 'recomputed';
import Updater from './Updater';
import Viewport from '../modules/Viewport';
import ScrollTracker, { Condition } from '../modules/ScrollTracker';

const defaultIdentityFunction = a => a.id;

const nullFunction = () => null;

class VirtualScroller extends React.PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
    renderItem: PropTypes.func.isRequired,
    viewport: PropTypes.instanceOf(Viewport).isRequired,
    identityFunction: PropTypes.func,
    offscreenToViewportRatio: PropTypes.number,
    assumedItemHeight: PropTypes.number,
    nearEndProximityRatio: PropTypes.number,
    nearStartProximityRatio: PropTypes.number,
    onAtStart: PropTypes.func,
    onNearStart: PropTypes.func,
    onNearEnd: PropTypes.func,
    onAtEnd: PropTypes.func,
  };

  static defaultProps = {
    identityFunction: defaultIdentityFunction,
    offscreenToViewportRatio: 1.8,
    assumedItemHeight: 400,
    nearEndProximityRatio: 1.75,
    nearStartProximityRatio: 0.25,
    onAtStart: nullFunction,
    onNearStart: nullFunction,
    onNearEnd: nullFunction,
    onAtEnd: nullFunction,
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

    this._handlePositioningUpdate = this._handlePositioningUpdate.bind(this);
    this._createScrollTracker(props.nearStartProximityRatio, props.nearEndProximityRatio);
  }

  _handlePositioningUpdate(position) {
    if (this._scrollTracker) {
      this._scrollTracker.handlePositioningUpdate(position);
    }
  }

  _createScrollTracker(nearStartProximityRatio, nearEndProximityRatio) {
    this._scrollTracker = new ScrollTracker([
      {
        condition: Condition.nearTop(5),
        callback: info => {
          return this.props.onAtStart(info);
        },
      },
      {
        condition: Condition.nearTopRatio(nearStartProximityRatio),
        callback: info => {
          return this.props.onNearStart(info);
        },
      },
      {
        condition: Condition.nearBottomRatio(nearEndProximityRatio),
        callback: info => {
          return this.props.onNearEnd(info);
        },
      },
      {
        condition: Condition.nearBottom(5),
        callback: info => {
          return this.props.onAtEnd(info);
        },
      },
    ]);
  }

  componentWillReceiveProps(nextProps) {
    this._createScrollTracker(nextProps.nearStartProximityRatio, nextProps.nearEndProximityRatio);
  }

  render() {
    const { renderItem, assumedItemHeight, viewport } = this.props;

    return (
      <Updater
        list={this._getList()}
        renderItem={renderItem}
        assumedItemHeight={assumedItemHeight}
        viewport={viewport}
        onPositioningUpdate={this._handlePositioningUpdate}
      />
    );
  }
}

export default VirtualScroller;
