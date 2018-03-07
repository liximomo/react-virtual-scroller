import findIndex from './findIndex';

function searchIndexWhen(list, initSearchIndex, predicator) {
  if (initSearchIndex < 0 || initSearchIndex >= list.length) {
    return -1;
  }

  if (predicator(list[initSearchIndex])) {
    return initSearchIndex;
  }

  for (let step = 1; ; step++) {
    const back = initSearchIndex - step;
    const forward = initSearchIndex + step;
    const illegal = back < 0;
    const outOfBound = forward >= list.length;
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
  const newIds = newList.reduce((ids, item) => {
    // eslint-disable-next-line no-param-reassign
    ids[item.id] = true;
    return ids;
  }, {});

  const commonItemIndex = searchIndexWhen(originList, sliceStart, item => newIds[item.id]);
  if (-1 === commonItemIndex) {
    return null;
  }

  const newSliceStart = findIndex(newList, item => originList[commonItemIndex].id === item.id);

  return {
    sliceStart: newSliceStart,
    sliceEnd: Math.min(newList.length, newSliceStart + sliceEnd - sliceStart),
  };
}

export default findNewSlice;
