function findIndex(list, predictor, startIndex = 0) {
  for (let index = 0 + startIndex; index < list.length; index++) {
    if (predictor(list[index], index)) {
      return index;
    }
  }

  return -1;
}

export default findIndex;
