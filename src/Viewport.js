import Rect from './Rect';

class Viewport {
  constructor(window) {
    this._window = window;
    this._scrolledByListeners = [];
    this._offsetTop = 0;
  }

  _getWindowHeight() {
    return Math.ceil(this._window.document.documentElement.clientHeight);
  }

  _addListener(event, listener) {
    const eventCallback = () => {
      return listener()
    };

    this._window.addEventListener(event, eventCallback);

    return () => {
      this._window.removeEventListener(event, eventCallback)
    };
  }

  setOffsetTop(value) {
    this._offsetTop = value;
  }

  getRect() {
    const windowHeight = this._getWindowHeight();
    const height = Math.max(0, windowHeight - this._offsetTop);
    return new Rect({ top: this._offsetTop, height });
  }

  // get scroll left
  scrollX() {
    return -1 * this._window.document.body.getBoundingClientRect().left;
  }

  // get scroll top
  scrollY() {
    return -1 * this._window.document.body.getBoundingClientRect().top;
  }

  scrollBy(vertically) {
    this._window.scrollBy(0, vertically),
    this._scrolledByListeners.forEach(listener => listener(vertically));
  }

  addRectChangeListener(listener) {
    return this._addListener('resize', listener);
  }

  addScrollListener(listener) {
    return this._addListener('scroll', listener);
  }

  // listener triggered by programmatic scroll
  addProgrammaticScrollListener(listener) {
    if (this._scrolledByListeners.indexOf(listener) < 0) this._scrolledByListeners.push(listener);
    return () => this.removeProgrammaticScrollListener(listener);
  }

  removeProgrammaticScrollListener(listener) {
    const index = this._scrolledByListeners.indexOf(listener);
    if (index > -1) this._scrolledByListeners.splice(index, 1);
  }
}

export default Viewport;
