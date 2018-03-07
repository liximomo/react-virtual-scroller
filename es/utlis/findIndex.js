function findIndex(list, predictor) {
  var startIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  for (var index = 0 + startIndex; index < list.length; index++) {
    if (predictor(list[index], index)) {
      return index;
    }
  }

  return -1;
}

export default findIndex;