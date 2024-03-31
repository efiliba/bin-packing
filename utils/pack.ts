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

const itemAtMinTotalHeight = (points: Point[], ignoreColumn?: number) => {
  // In each column get item at last row
  const itemsAtLastRow = points.reduce((columns, point) => ({
    ...columns,
    ...(point.column !== ignoreColumn && { [point.column]: point })
  }), {});

  // Find last item in row with min total height
  return Object.values<Point>(itemsAtLastRow).reduce((acc, point) => ({
    ...acc,
    ...(acc.y + acc.height > point.y + point.height && point)
  }), { y: 0, height: Infinity } as Point);
};

const getMaxWidthInColumn = (points: Point[], column: number) =>
  Math.max(...points.filter(point => point.column === column).map(({ width }) => width));

const getItemWithMaxWidthInLastColumn = (points: Point[]) => {
  const itemWithMaxWidthInLastColumn = points.reduce((item, point) => ({
    ...item,
    ...(point.column > item.column && point.width > item.width &&  point)
  }), { column: 0, width: 0, x: 0 });

  return {
    ...itemWithMaxWidthInLastColumn,
    maxWidth: getMaxWidthInColumn(points, itemWithMaxWidthInLastColumn.column),
  }
};

const shiftUpColumnsFrom = (points: Point[], fromColumn: number, offset: number) =>
  points.reduce((acc, point) => [
    ...acc,
    {
      ...point,
      ...(point.column > fromColumn && { x: point.x + offset })
    }
  ], [] as Point[]);

const shiftNextColumnsAsRequired = (points: Point[], itemWidth: number, sheetWidth: number, ignoreColumn?: number) => {
  // Get last item in the row that is the least vertically filled 
  const itemAtMinHeight = itemAtMinTotalHeight(points, ignoreColumn);

  // Determine current max width of the column the new item will be added to
  const maxWidthInColumn = getMaxWidthInColumn(points, itemAtMinHeight.column);

  let shiftedPoints: Point[] | undefined;
  let overflowInColumn: number | undefined;
  let width = itemWidth;

  if (width > maxWidthInColumn) {
    // Rows to the right will need to be shifted
    shiftedPoints = shiftUpColumnsFrom(points, itemAtMinHeight.column, width - maxWidthInColumn);

    const lastColumnItem = getItemWithMaxWidthInLastColumn(shiftedPoints);    // last proposed column

    // Last column may no longer fit horizontally after right shifts
    if (lastColumnItem.x + lastColumnItem.maxWidth > sheetWidth) {
      overflowInColumn = itemAtMinHeight.column;
    }
  } else {
    width = maxWidthInColumn;                                                 // Update the next popped value's x
  }

  return {
    x: itemAtMinHeight.x,
    y: itemAtMinHeight.y + itemAtMinHeight.height,
    column: itemAtMinHeight.column,
    width,
    shiftedPoints,
    overflowInColumn
  };
};

const addNextLookupItem = (sheet: Size, lookup: Lookup) => {
  const addNextItem = (points: Point[], item: string, _?: number, __?: string[], ignoreColumn?: number): Point[] => {
    let { x = 0, y = 0, column = 0 } = points.pop() || {};
    let [ width, height ] = lookup[item].size;
    let shiftedPoints: Point[] | undefined;
    let overflowInColumn: number | undefined;

    // Check if next item fits horizontally and column not created yet (empty)
    if (x + width <= sheet.width && points.every(point => point.column !== column)) {
      y = 0;                                                                  // New point will start at top row
    } else {
      ({ x, y, column, width, shiftedPoints, overflowInColumn } =
        shiftNextColumnsAsRequired(points, width, sheet.width, ignoreColumn));
    }

    // If there is an overflow - re-add the item ignoring the problem column
    if (overflowInColumn !== undefined) {
      return addNextItem(
        points.concat({ x: 0, y: 0, width: 0, height: 0, column: 0 }),
        item,
        undefined,
        undefined,
        overflowInColumn
      );
    }

    return [
      ...(shiftedPoints ?? points),
      { x, y, width, height, column },
      { x: x + width, y: 0, width: 0, height: 0, column: column + 1 }
    ];
  };

  return addNextItem;
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
