const PROXIMITY = {
  INSIDE: 'inside',
  OUTSIDE: 'outside',
};

const TRIGGER_CAUSE = {
  INITIAL_POSITION: 'init',
  MOVEMENT: 'movement',
  LIST_UPDATE: 'list-update',
};

function getProximity(condition, position) {
  return condition(position.getListRect(), position.getViewportRect())
    ? PROXIMITY.INSIDE
    : PROXIMITY.OUTSIDE;
}

function findCause(prevState, nextState) {
  const isInit = !prevState.proximity && nextState.proximity === PROXIMITY.INSIDE;
  if (isInit) {
    return TRIGGER_CAUSE.INITIAL_POSITION;
  }

  const isMovement =
    prevState.proximity === PROXIMITY.OUTSIDE && nextState.proximity === PROXIMITY.INSIDE;
  if (isMovement) {
    return TRIGGER_CAUSE.MOVEMENT;
  }

  const stay = prevState.proximity === PROXIMITY.INSIDE && nextState.proximity === PROXIMITY.INSIDE;
  if (stay && prevState.listLength !== nextState.listLength) {
    return TRIGGER_CAUSE.LIST_UPDATE;
  }

  return null;
}

const Condition = {
  nearTop(distance) {
    return (list, viewport) => {
      return viewport.getTop() - list.getTop() <= distance;
    };
  },
  nearBottom(distance) {
    return (list, viewport) => {
      return list.getBottom() - viewport.getBottom() <= distance;
    };
  },
  nearTopRatio(ratio) {
    return (list, viewport) => {
      const viewportHeight = viewport.getHeight();
      const distance = ratio * viewportHeight;
      return viewport.getTop() - list.getTop() <= distance;
    };
  },
  nearBottomRatio(ratio) {
    return (list, viewport) => {
      const viewportHeight = viewport.getHeight();
      const distance = ratio * viewportHeight;
      return list.getBottom() - viewport.getBottom() <= distance;
    };
  },
};

class ScrollTracker {
  constructor(zones) {
    this._handlers = zones.map(zone => ({
      zone,
      state: {},
    }));
  }

  handlePositioningUpdate(position) {
    this._handlers.forEach(({ zone, state }) => {
      const { condition, callback } = zone;
      const newProximity = getProximity(condition, position);
      const newListLength = position.getList().length;
      const triggerCause = findCause(state, {
        proximity: newProximity,
        listLength: newListLength,
      });

      /* eslint-disable no-param-reassign */
      state.proximity = newProximity;
      state.listLength = newListLength;
      /* eslint-enable */

      if (triggerCause) {
        callback({
          triggerCause,
        });
      }
    });
  }
}

export default ScrollTracker;

export { Condition };
