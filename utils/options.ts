export type Rectangle = {
  id: string;
  size: [number, number];
  quantity: number;
  color: string;
}

// List of options to select from but may also be rotated
// E.g.: { id: 'a', size: [10, 20], quantity: 2 } // sizes different, need to rotate
//   returns: [
//      ['a', 'a'],     // select 2a
//      ['a', 'a`'],    // OR 1a and 1 rotated a 
//      ['a`', 'a`'],   // OR 2 rotated a's
//    ]
const extractAllOptions = ({ id, size: [x, y], quantity }: Rectangle) => {
  const options = [new Array<string>(quantity).fill(id)];

  if (x !== y) {        // Rotate and add different options
    for (let index = 1; index <= quantity; index++) {
      options.push([...new Array(quantity - index).fill(id), ...new Array(index).fill(`${id}\``)])
    }
  }

  return options;
};

const distribute = <T>(head: T[], rest: T[][]) => rest.map((options: T[]) => [...head,  ...options]);

const multiplyOptions = <T>([head, ...tail]: T[][][]): T[][] =>
  tail.length === 0 ? head : head.reduce((options, curr) => [...options, ...distribute(curr, multiplyOptions(tail))], [] as T[][]);

export const enumerateOptions = (rectangles: Rectangle[]) => multiplyOptions(rectangles.map(extractAllOptions));
