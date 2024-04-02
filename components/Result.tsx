import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { useCanvas } from '@/hooks';
import { getRectangles, Rectangle } from '@/utils';

type Props = {
  className: string;
  canvas: {
    width: number;
    height: number;
  };
  sheet: {
    width: number;
    height: number;
  };
  rectangles: Rectangle[];
  options: string[];
};

const resizeRect = (scaleX: number, scaleY: number) => ([ x, y, w, h ]: [ number, number, number, number ]) =>
  [ x * scaleX, y * scaleY, w * scaleX, h * scaleY ] as [ number, number, number, number ];

export const Result = ({ className, canvas, sheet, rectangles, options }: Props) => {
  const resize = useMemo(() => resizeRect(canvas.width / sheet.width, canvas.height / sheet.height), [canvas, sheet]);

  const draw = (context: CanvasRenderingContext2D) =>
    getRectangles(sheet, rectangles)(options).forEach(({ rectangle, color, symbol }) => {
      const resizeRect = resize(rectangle);

      context.strokeStyle = 'white';
      context.fillStyle = color;
      context.fillRect(...resizeRect);
      context.strokeRect(...resizeRect);
    });

  const canvasRef = useCanvas(draw, canvas);

  return (
    <canvas ref={canvasRef} className={cn('border', className)} width={canvas.width} height={canvas.height} />
  );
};
