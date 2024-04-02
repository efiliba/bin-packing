import { ChangeEvent } from 'react';

import { Label, Input } from '@/components/ui';

type Props = {
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
};

export const SheetDimensions = ({ width, height, onWidthChange, onHeightChange }: Props) => {
  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => onWidthChange(e.target.valueAsNumber);

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => onHeightChange(e.target.valueAsNumber);

  return (
    <fieldset className="grid grid-cols-4 sm:grid-cols-5 gap-4 items-center p-4 border-2 rounded">
      <legend className="px-2">Set sheet dimensions</legend>
      <Label htmlFor="width">Width:</Label>
      <Input className="text-right"type="number" id="width" min={0} value={width} onChange={handleWidthChange} />
      <Label className="sm:col-start-4" htmlFor="height">Height:</Label>
      <Input className="text-right" type="number" id="height" min={0} value={height} onChange={handleHeightChange} />
    </fieldset>
  );
};
