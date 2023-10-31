export function findLastIndex<T>(
  arr: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean
) {
  let i = arr.length;
  while (i--) {
    if (predicate(arr[i], i, arr)) {
      return i;
    }
  }
  return -1;
}
