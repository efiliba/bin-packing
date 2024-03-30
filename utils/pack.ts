import type { Rectangle } from '@/utils/options';

type Size = {
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
  height: number;
  width: number;
  column: number;
};

type Lookup = Record<string, { size: [ number, number ]; color: string }>;

// Need to also ensure within cutting grid - straight lines

const itemAtMinTotalHeight = (points: Point[]) => {
  // In each column get item at last row
  const itemsAtLastRow = points.reduce((columns, point) => ({
    ...columns,
    [point.column]: point
  }), {});

  // Find last item in row with min total height
  return Object.values<Point>(itemsAtLastRow).reduce((acc, point) => ({
    ...acc,
    ...(acc.y + acc.height > point.y + point.height && point)
  }), { y: 0, height: Infinity } as Point);
};

const getMaxWidthInColumn = (points: Point[], column: number) =>
  Math.max(...points.filter(point => point.column === column).map(({ width }) => width));

const shiftUpColumnsFrom = (points: Point[], fromColumn: number, offset: number) =>
  points.reduce((acc, point) => [
    ...acc,
    {
      ...point,
      ...(point.column > fromColumn && { x: point.x + offset })
    }
  ], [] as Point[]);

const addNextLookupItem = (sheet: Size, lookup: Lookup) => (points: Point[], item: string) => {
  let { x = 0, y = 0, column = 0 } = points.pop() || {};
  let [ width, height ] = lookup[item].size;

  console.table(points)

  if (x + width <= sheet.width && points.every(point => point.column !== column)) {
    y = 0;  // Fits in sheet horizontally but column does not exist yet
  } else {
    const itemAtMinHeight = itemAtMinTotalHeight(points);

    // Check if other columns need to be shifted up - and if still within bounds

    // Update other items in this column's widths

    const maxWidthInColumn = getMaxWidthInColumn(points, itemAtMinHeight.column);

    if (width > maxWidthInColumn) {

    // TODO: Check bounds 
    //                      test: const options = [ 'a', 'b', 'a', 'a', 'b'];
    //   to shift up, need offset amount left in sheet
    //     i.e. check last column end + offset <= sheet.width

      points = shiftUpColumnsFrom(points, itemAtMinHeight.column, width - maxWidthInColumn);
    } else {
      width = maxWidthInColumn;   // Need to update the next popped value's x
    }

    x = itemAtMinHeight.x;
    y = itemAtMinHeight.y + itemAtMinHeight.height;
    column = itemAtMinHeight.column;
  }

  return [
    ...points,
    { x, y, width, height, column },
    { x: x + width, y: 0, width: 0, height: 0, column: column + 1 }
  ];
};

const extractPoint = ({ x, y }: { x: number; y: number; }): [ number, number ] => [ x, y ];

// Convert array of rectangles to a lookup of sizes, by id
// E.g.: [{
//   id: 'a',
//   size: [20, 20],
//   quantity: 2,
//   color: 'red'
// }, {
//   id: 'b',
//   size: [25, 30],
//   quantity: 1,
//   color: 'blue'
// }];
//
// Transformed to: {
//   a: { size: [20, 20], color: 'red' },
//   b: { size: [25, 30], color: 'blue' },
// }
const toLookup = (options: Rectangle[]) => options.reduce((lookup, { id, size, color }) => ({
  ...lookup,
  [id]: { size, color }
}), {} as Lookup);

export const getRectangles = (sheet: Size, rectangles: Rectangle[]) => {
  const lookup = toLookup(rectangles);
  const addNextItem = addNextLookupItem(sheet, lookup);

  return (options: string[]) => {
    const points = options.reduce(addNextItem, [ { x: 0, y: 0, width: 0, height: 0, column: 0 } ]);
    points.pop();

    return points.map((item, index) => {
      const symbol = options[index];
      const { size, color } = lookup[symbol];

      return {
        rectangle: [ ...extractPoint(item), ...size ] as [ number, number, number, number ],
        color,
        symbol,
        column: item.column
      };
    });
  };
};
