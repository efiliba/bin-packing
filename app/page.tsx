"use client";

import { useState } from 'react';

import { useScreenWidth } from '@/hooks';
import { Button } from '@/components/ui';
import { permutations, enumerateOptions, Rectangle } from '@/utils';
import { SheetDimensions, AddItems, Item, Result } from '@/components';

const colors = ['red', 'blue', 'green', 'purple', 'gray'];

const mapToRectangles = (items: Item[]): Rectangle[] =>
  items.map(({ width, height, quantity }, index) => ({
    id: String.fromCharCode(index + 97),                                      // 'a', 'b', ...
    size: [width, height],
    quantity,
    color: colors[index % colors.length]
  }));

export default function Home() {
  const [ sheet, setSheet ] = useState({ width: 50, height: 40, aspectRatio: 1 });
  
  const screenWidth = useScreenWidth(48);

  const canvas = { width: screenWidth, height: screenWidth * sheet.aspectRatio };

  const [ items, setItems ] = useState([
    { width: 20, height: 20, quantity: 2 },
    { width: 10, height: 15, quantity: 2 },
    { width: 0, height: 0, quantity: 0 }
  ]);

  const [ count, setCount ] = useState(0);

  const [ options, setOptions ] = useState<string[]>([]);

  const handleSheetWidthChange = (width: number) =>
    setSheet(({ height }) => ({
      height,
      width,
      aspectRatio: height / width
    }));

  const handleSheetHeightChange = (height: number) =>
    setSheet(({ width }) => ({
      height,
      width,
      aspectRatio: height / width
    }));

  const handleCalculateClick = () => {
    const rectangles = mapToRectangles(items);
    setOptions(permutations(enumerateOptions(rectangles)[0])[count]);
  };

  const handleNextClick = () => setCount(c => c + 1);

  // Check each permutation and return the max depth i.e. number of items added sequentialy without overflow
  return (
    <main className="py-2">
      {/* Map rectangles to characters 'a', 'b', ... - may also need to rotate
      {enumerateOptions(rectangles).map((permutation, index) =>
        <div key={index}>{permutation}</div>
      )}
      <br />
      Check each permutation
      {permutations(enumerateOptions(rectangles)[0]).map((permutation, index) =>
        <div key={index}>{permutation}</div>
      )}
      <br /> */}
      <SheetDimensions width={sheet.width} height={sheet.height} onWidthChange={handleSheetWidthChange} onHeightChange={handleSheetHeightChange} />
      <AddItems className="mt-4" items={items} colors={colors} onItemsChange={setItems} />
      <Button className="mt-4" variant="secondary" onClick={handleCalculateClick}>Calculate</Button> 
      {/* <Button variant="destructive" onClick={handleNextClick}>Next</Button> */}
      <Result className="mt-4" canvas={canvas} sheet={sheet} rectangles={mapToRectangles(items)} options={options} />
    </main>
  );
}
