import React from 'react';
import PropTypes from 'prop-types';

const nullFunc = () => null;

function getHeightForDomNode(node) {
  return node ? node.getBoundingClientRect().height : 0;
}

class List extends React.PureComponent {
  static defaultProps = {
    getHeightForDomNode,
    list: [],
  };

  static propTypes = {
    getHeightForDomNode: PropTypes.func,
    blankSpaceAbove: PropTypes.number.isRequired,
    blankSpaceBelow: PropTypes.number.isRequired,
    renderItem: PropTypes.func.isRequired,
    list: PropTypes.arrayOf(PropTypes.any),
  };

  constructor(props) {
    super(props);

    this._refs = {};
    this._handleViewRefUpdate = this._handleViewRefUpdate.bind(this);
  }

  _handleViewRefUpdate(ref) {
    this._view = ref;
  }

  _handleItemRefUpdate(id, ref) {
    if (!ref) {
      delete this._refs[id];
    } else {
      this._refs[id] = ref;
    }
  }

  _renderContent() {
    return this.props.list.map((item, index) => {
      const id = item.id;
      const data = item.data;
      const reactElement = this.props.renderItem(data, index);
      const savedRefFunc = 'function' === typeof reactElement.ref ? reactElement.ref : nullFunc;
      return React.cloneElement(reactElement, {
        key: id,
        ref: r => {
          this._handleItemRefUpdate(id, r);
          savedRefFunc(r);
        },
      });
    });
  }

  getWrapperNode() {
    return this._view;
  }

  getItemHeights() {
    const { list, getHeightForDomNode } = this.props;

    return list.reduce((heightsMap, item) => {
      const id = item.id;
      const node = this._refs[id];

      // eslint-disable-next-line no-param-reassign
      heightsMap[id] = getHeightForDomNode(node);
      return heightsMap;
    }, {});
  }

  render() {
    const { blankSpaceAbove, blankSpaceBelow } = this.props;

    return (
      <div
        ref={this._handleViewRefUpdate}
        style={{
          paddingTop: blankSpaceAbove,
          paddingBottom: blankSpaceBelow,
        }}
        onScroll={this.handleScroll}
      >
        {this._renderContent()}
      </div>
    );
  }
}

export default List;
