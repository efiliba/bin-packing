import { useState } from 'react';

import { Button } from "@/components/ui";
import { Label } from '@/components/ui';
import { AddItem } from './AddItem';

export const AddItems = () => {
  const [state, setState ] = useState([ { width: 1, height: 1, quantity: 0 }]);

  const handleChange = (row: number) => (state: { width: number; height: number; quantity: number; }) => {
    setState(s => {
      s[row] = state;
      return s;
    });
  };

  const handleAddNewRow = () => {
    setState(state.concat([ { width: 0, height: 0, quantity: 0 }]));
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <Label>Width:</Label>
      <Label>Height:</Label>
      <Label>Quantity:</Label>
      {state.map(({ width, height, quantity }, index) => 
        <AddItem
          key={index}
          width={width}
          height={height}
          quantity={quantity}
          onChange={handleChange(index)}
          onAddNewRow={handleAddNewRow}
        />
      )}
      <Button onClick={handleAddNewRow}>Add a new row</Button>
    </div>
    // <AddItem width={1} height={2} quantity={3} />
  );
};
