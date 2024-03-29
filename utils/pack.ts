import type { Rectangle } from '@/utils/options';

type Size = {
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

type Lookup = Record<string, { size: [number, number]; color: string }>;

// Need to also ensure within cutting grid - straight lines


// Build up co-ords backwards to use [head, ...tail] pattern
const addNextLookupItem = (sheet: Size, lookup: Lookup) =>
  ([head, ...tail]: { x: number; y: number; h?: number }[], item: string) => {
    const [x, y] = lookup[item].size;

    // Check if item fits - may need to adjust next co-ord
    if (head.x + x <= sheet.width) {
      return [{ x: head.x + x, y: head.y }, { ...head, h: y }, ...tail];
    }

    // Look for gaps in current row where current item can fit
    const currentRowY = tail[0].y;
    const currentRow = tail.filter((item) => item.y === currentRowY);
    const gapIndex = currentRow.findIndex(cell => cell.y + (cell.h || 0) <= y);

    if (gapIndex >= 0) {
      // Gap found - need to adjust co-ords
      const gapItem = currentRow[gapIndex];
      const gapItemHeight = gapItem.h || 0;
      gapItem.h = gapItemHeight + y;                                          // Update height to designate the gap as filled

      tail.splice(gapIndex, 0, { x: gapItem.x, y: gapItemHeight, h: y });     // Mutates tail
      return [head, ...tail];
    } else {
      // Start of new row
      
      // May need to adjust all previous row x spacers - invalidating current placements
      
      const currentRowMaxHeight = Math.max(...currentRow.map(({h = 0}) => h));
      const startNextRow = head.y + currentRowMaxHeight;

      return [{ x, y: startNextRow }, { x: 0, y: startNextRow, h: y }, ...tail];
    }
};

const extractPoint = ({ x, y }: { x: number; y: number }): [number, number] => [x, y];

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
    const [, ...tail] = options.reduce(addNextItem, [{ x: 0, y: 0 }]);

    return tail.reverse().map((item, index) => {
      const symbol = options[index];
      const { size, color } = lookup[symbol];

      return {
        rectangle: [...extractPoint(item), ...size] as [number, number, number, number],
        color,
        symbol
      };
    });
  };
};
