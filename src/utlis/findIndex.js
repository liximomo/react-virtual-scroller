function findIndex(list, predictor) {
  for (let index = 0; index < list.length; index++) {
    if (predictor(list[index], index)) {
      return index;
    }
  }

  return -1;
}

export default findIndex;
