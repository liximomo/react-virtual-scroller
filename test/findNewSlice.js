import findNewSlice from '../src/utlis/findNewSlice';

describe('findNewSlice', () => {
  test('should find new slice when insert new elements at start', () => {
    const slice = findNewSlice(
      [{ id: 1 }, { id: 2 }, { id: 3 }],
      [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
      1,
      3
    );

    expect(slice).toEqual({
      sliceStart: 2,
      sliceEnd: 4,
    });
  });

  test('should find new slice when insert new elements at end', () => {
    const slice = findNewSlice(
      [{ id: 1 }, { id: 2 }, { id: 3 }],
      [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4}],
      1,
      3
    );

    expect(slice).toEqual({
      sliceStart: 1,
      sliceEnd: 3,
    });
  });

  test('should find new slice when delete some element', () => {
    const slice = findNewSlice(
      [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
      [{ id: 1 }, { id: 3 }, { id: 5},  { id: 6 }],
      1,
      5
    );

    expect(slice).toEqual({
      sliceStart: 1,
      sliceEnd: 4,
    });
  });

  test('should not find new slice when no common item', () => {
    const slice = findNewSlice(
      [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
      [{ id: 7 }, { id: 8 }, { id: 9 }],
      1,
      5
    );

    expect(slice).toBe(null);
  });
});
