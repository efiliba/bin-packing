"use client";

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Label, Button } from '@/components/ui';
import { AddItem } from './AddItem';

export type Item = {
  width: number;
  height: number;
  quantity: number;
};

type Props = {
  className: string;
  items: Item[];
  colors: string[];
  onItemsChange: (items: Item[]) => void;
};

export const AddItems = ({ className, items, colors, onItemsChange }: Props) => {
  const [ state, setState ] = useState(items);

  const [ newRowAdded, setNewRowAdded ] = useState(items.map(({ quantity }) => quantity !== 0));

  const handleChange = (row: number) => (item: Item) => {
    const nextState = state.with(row, item);

    process.nextTick(() => {
      setState(nextState);
      onItemsChange(nextState);
    });
  };

  const handleQuantityChange = (row: number) => (item: Item) => {
    // if (!newRowAdded[row]) {
    //   setNewRowAdded(newRowAdded.with(row, true));
    //   handleAddNewRow();
    // }

    handleChange(row)(item);
  };

  const handleAddNewRow = () => setState(state.concat([ { width: 0, height: 0, quantity: 0 }]));

  const handleClear = () => setState(() => [ { width: 0, height: 0, quantity: 0 }]);
  
  return (
    <fieldset className={cn('grid grid-cols-[20px_1fr_1fr_1fr] gap-2 items-center p-4 border-2 rounded', className)}>
      <legend className="px-2">Add items</legend>
      <Label className="col-start-2">Width:</Label>
      <Label>Height:</Label>
      <Label>Quantity:</Label>
      {state.map(({ width, height, quantity }, index) =>
        <AddItem
          key={index}
          width={width}
          height={height}
          quantity={quantity}
          color={colors[index % colors.length]}
          onWidthChange={handleChange(index)}
          onHeightChange={handleChange(index)}
          onQuantityChange={handleQuantityChange(index)}
        />
      )}
      <Button className="col-span-2" onClick={handleAddNewRow}>Add a new row</Button>
      {/* <Button className="col-end-[-1]" variant="destructive" onClick={handleClear}>Clear</Button> */}
    </fieldset>
  );
};
