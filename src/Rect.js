function isBetween(value, begin, end) {
  return value >= begin && value < end;
}

class Rect {
  constructor({ top = 0, left = 0, height = 0, width = 0 } = {}) {
    this._top = top;
    this._left = left;
    this._height = height;
    this._width = width;
  }

  getTop() {
    return this._top;
  }

  getBottom() {
    return this._top + this._height;
  }

  getLeft() {
    return this._left;
  }

  getRight() {
    return this._left + this._width;
  }

  getHeight() {
    return this._height;
  }

  getWidth() {
    return this._width;
  }

  doesIntersectWith(rect) {
    const top = this.getTop();
    const bottom = this.getBottom();
    const left = this.getLeft();
    const right = this.getRight();
    const aTop = rect.getTop();
    const aBottom = rect.getBottom();
    const aLeft = rect.getLeft();
    const aRight = rect.getRight();

    return (
      isBetween(top, aTop, aBottom) ||
      isBetween(aTop, top, bottom) ||
      isBetween(left, aLeft, aRight) ||
      isBetween(aLeft, left, right)
    );
  }

  contains(point) {
    if (point.x === undefined) {
      return isBetween(point.y, this.getTop(), this.getBottom());
    } else if (point.y === undefined) {
      return isBetween(point.x, this.getLeft(), this.getRight());
    } else {
      return isBetween(point.y, this.getTop(), this.getBottom()) && isBetween(point.x, this.getLeft(), this.getRight());
    }
  }

  translateBy(x, y) {
    let left = this.getLeft();
    let top = this.getTop();

    if (x) {
      left += x;
    }

    if (y) {
      top += y;
    }

    return new Rect({
      left,
      top,
      width: this.getWidth(),
      height: this.getHeight(),
    });
  }
}

export default Rect;
