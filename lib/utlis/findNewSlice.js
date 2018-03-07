'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _findIndex = require('./findIndex');

var _findIndex2 = _interopRequireDefault(_findIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function searchIndexWhen(list, initSearchIndex, predicator) {
  if (initSearchIndex < 0 || initSearchIndex >= list.length) {
    return -1;
  }

  if (predicator(list[initSearchIndex])) {
    return initSearchIndex;
  }

  for (var step = 1;; step++) {
    var back = initSearchIndex - step;
    var forward = initSearchIndex + step;
    var illegal = back < 0;
    var outOfBound = forward >= list.length;
    if (illegal && outOfBound) {
      break;
    }
    if (!outOfBound && predicator(list[forward])) {
      return forward;
    }

    if (!illegal && predicator(list[back])) {
      return back;
    }
  }

  return -1;
}

function findNewSlice(originList, newList, sliceStart, sliceEnd) {
  var newIds = newList.reduce(function (ids, item) {
    // eslint-disable-next-line no-param-reassign
    ids[item.id] = true;
    return ids;
  }, {});

  var commonItemIndex = searchIndexWhen(originList, sliceStart, function (item) {
    return newIds[item.id];
  });
  if (-1 === commonItemIndex) {
    return null;
  }

  var newSliceStart = (0, _findIndex2.default)(newList, function (item) {
    return originList[commonItemIndex].id === item.id;
  });

  return {
    sliceStart: newSliceStart,
    sliceEnd: Math.min(newList.length, newSliceStart + sliceEnd - sliceStart)
  };
}

exports.default = findNewSlice;