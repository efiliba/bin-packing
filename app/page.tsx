"use client"

import { useMemo } from 'react';

import { useCanvas } from '@/hooks/useCanvas';
import { permutations } from '@/utils/permutations';
import { enumerateOptions, Rectangle } from '@/utils/options';
import { getRectangles } from '@/utils/pack';

const resizeRect = (scaleX: number, scaleY: number) => ([x, y, w, h]: [number, number, number, number]) =>
  [x * scaleX, y * scaleY, w * scaleX, h * scaleY] as [number, number, number, number];

const canvas = { width: 400, height: 600 };

const sheet = { width: 30, height: 50 };

export default function Home() {
  // Load rectangle sizes and quantities
  const rectangles: Rectangle[] = [{
    id: 'a',
    size: [15, 10],
    quantity: 2,
    color: 'red'
  }, {
    id: 'b',
    size: [15, 20],
    quantity: 1,
    color: 'blue'
  // }, {
  //   id: 'c',
  //   size: [20, 30],
  //   quantity: 1,
  //   color: 'green'
  }];

  const options = permutations(enumerateOptions(rectangles)[0])[0];  // First option - test development of UI

  const resize = useMemo(() => resizeRect(canvas.width / sheet.width, canvas.height / sheet.height), []);

  const draw = (context: CanvasRenderingContext2D) =>
    getRectangles(sheet, rectangles)(options).forEach(({ rectangle, color, symbol }) => {
      const resizeRect = resize(rectangle);

      context.strokeStyle = 'white';
      context.fillStyle = color;
      // context.lineWidth = 1;
      context.fillRect(...resizeRect);
      context.strokeRect(...resizeRect);
    });

  const canvasRef = useCanvas(draw, canvas);

  // getRectangles(rectangles)(options);

  // Check each permutation and return the max depth i.e. number of items added sequentialy without overflow
  return (
    <main className="">
      {/* Map rectangles to characters 'a', 'b', ... - may also need to rotate */}
      {enumerateOptions(rectangles).map((permutation, index) =>
        <div key={index}>{permutation}</div>
      )}
      <br />
      {/* Check each permutation */}
      {permutations(enumerateOptions(rectangles)[0]).map((permutation, index) =>
        <div key={index}>{permutation}</div>
      )}
      <br />
      {JSON.stringify(getRectangles(sheet, rectangles)(options), null, 2)}
      <br />
      <canvas ref={canvasRef} className="border" width={canvas.width} height={canvas.height} />
    </main>
  );
}
