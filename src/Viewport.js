import Rectangle from './Rectangle';

class Viewport {
  constructor(window, scroller = window) {
    this._scroller = scroller;
    this._window = window;
    this._programticScrollListeners = [];
    this._offsetTop = 0;
    this._useWindow = this._scroller === this._window;
  }

  _getScrollerHeight() {
    if (this._useWindow) {
      return Math.ceil(this._window.document.documentElement.clientHeight);
    }

    return this._scroller.clientHeight;
  }

  _addListener(event, listener, useWindow) {
    const target = useWindow ? this._window : this._scroller;

    const eventCallback = () => {
      return listener();
    };

    target.addEventListener(event, eventCallback);

    return () => {
      target.removeEventListener(event, eventCallback)
    };
  }

  setOffsetTop(value) {
    this._offsetTop = value;
  }

  getRect() {
    const windowHeight = this._getScrollerHeight();
    const height = Math.max(0, windowHeight - this._offsetTop);
    return new Rectangle({ top: this._offsetTop, height });
  }

  // get scroll left
  scrollX() {
    if (this._useWindow) {
      return -1 * this._window.document.body.getBoundingClientRect().left;
    }
  
    return this._scroller.scrollLeft;
  }

  // get scroll top
  scrollY() {
    if (this._useWindow) {
      return -1 * this._window.document.body.getBoundingClientRect().top;
    }

    return this._scroller.scrollTop;
  }

  scrollBy(vertically) {
    if (this._window) {
      this._window.scrollBy(0, vertically);
    } else {
      this._scroller.scrollTop += vertically;
    }

    this._programticScrollListeners.forEach(listener => listener(vertically));
  }

  addRectChangeListener(listener) {
    return this._addListener('resize', listener, true);
  }

  addScrollListener(listener) {
    return this._addListener('scroll', listener, false);
  }

  // listener triggered by programmatic scroll
  addProgrammaticScrollListener(listener) {
    if (this._programticScrollListeners.indexOf(listener) < 0) this._programticScrollListeners.push(listener);
    return () => this.removeProgrammaticScrollListener(listener);
  }

  removeProgrammaticScrollListener(listener) {
    const index = this._programticScrollListeners.indexOf(listener);
    if (index > -1) this._programticScrollListeners.splice(index, 1);
  }
}

export default Viewport;
