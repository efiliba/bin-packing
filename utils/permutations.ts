const distribute = <T>(head: T, rest: T[] | T[][]) => rest.map((data: T | T[]) => {
  if (Array.isArray(data)) {
    return [head,  ...data];
  }
  return [head, data];
});

const removeItemAtIndex = <T>(items: T[], index: number) => {
  const remainingItems = [...items];
  remainingItems.splice(index, 1);

  return remainingItems;
};

const enumeratePermutations = <T>(items: T[]): T[] | T[][] =>
  items.length === 1
    ? items
    : items.reduce((permutations, item, index) =>
      [...permutations, ...distribute(item, enumeratePermutations(removeItemAtIndex(items, index)))]
    , [] as T[][]);

const mapItemValues = (items: string[]) =>
  [...new Set(items)].reduce((uniqueItemValues, item, index) => ({
    ...uniqueItemValues,
    [item]: index
  }), {});

const mapPowers = (n: number) => {
  const powers = [1];
  for (let index = 1, power = n; index < n; index++) {
    powers.push(power);
    power *= n;
  }

  return powers;
};

const hashFn =  (itemValueLookup: Record<string, number>, powers: number[]) =>
  (items: string[]) =>
    items.reduce((value, item, column) =>
      value + itemValueLookup[item] * powers[column]
    , 0);

const deDuplicate = (items: string[]) => (permutations: string[][]) => {
  const hash = hashFn(mapItemValues(items), mapPowers(items.length));
  const hashes: boolean[] = [];

  return permutations.filter(permutation => {
    const hashValue = hash(permutation);
    if (hashes[hashValue]) {
      return false;
    }
    hashes[hashValue] = true;
    return true;
  });
};

export const permutations = (items: string[]) => deDuplicate(items)(enumeratePermutations(items) as string[][]);
