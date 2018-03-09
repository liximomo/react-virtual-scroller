import Rectangle from './Rectangle';
import findIndex from '../utlis/findIndex';

class Position {
  constructor({ viewportRectangle, list, rectangles, sliceStart, sliceEnd }) {
    this._viewportRectangle = viewportRectangle;
    this._list = list;
    this._rectangles = rectangles;
    this._sliceStart = sliceStart;
    this._sliceEnd = sliceEnd;
  }

  getViewportRect() {
    return this._viewportRectangle;
  }

  getListRect() {
    const list = this._list;
    if (list.length <= 0) {
      return new Rectangle({
        top: 0,
        height: 0,
      });
    }

    const rects = this._rectangles;
    const firstItemId = list[0].id;
    const lastItemId = list[list.length - 1].id;
    const top = rects[firstItemId].getTop();
    const height = rects[lastItemId].getBottom() - top;
    return new Rectangle({
      top,
      height,
    });
  }

  getAllItems() {
    return this._list.map(item => {
      const id = item.id;
      return {
        id,
        rectangle: this._rectangles[id],
      };
    });
  }

  getList() {
    return this._list;
  }

  getItemRect(id) {
    return this._rectangles[id];
  }

  findVisibleItems() {
    const viewportRectangle = this._viewportRectangle;
    const rectangles = this._rectangles;
    const list = this._list;
    const startIndex = findIndex(list, item => {
      const id = item.id;
      return rectangles[id].doesIntersectWith(viewportRectangle);
    });
    if (startIndex < 0) {
      return [];
    }

    let endIndex = findIndex(
      list,
      item => {
        const id = item.id;
        return !rectangles[id].doesIntersectWith(viewportRectangle);
      },
      startIndex
    );
    if (endIndex < 0) {
      endIndex = list.length;
    }

    return list
      .slice(startIndex, endIndex)
      .filter(item => {
        const id = item.id;
        return this.isRendered(id);
      })
      .map(item => {
        const id = item.id;
        return {
          id,
          rectangle: rectangles[id],
        };
      });
  }

  getRenderedItems() {
    const rectangles = this._rectangles;
    return this._list.slice(this._sliceStart, this._sliceEnd).map(item => {
      const id = item.id;
      return {
        id,
        rectangle: rectangles[id],
      };
    });
  }

  isRendered(id) {
    return this._getRenderedIdSet().hasOwnProperty(id);
  }

  _getRenderedIdSet() {
    if (!this._renderedIdSet) {
      this._renderedIdSet = {};
      for (let t = this._sliceStart; t < this._sliceEnd; t++) {
        this._renderedIdSet[this._list[t].id] = true;
      }
    }

    return this._renderedIdSet;
  }
}

export default Position;
