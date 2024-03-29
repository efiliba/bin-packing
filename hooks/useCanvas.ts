import { useEffect, useRef } from 'react';

export const useCanvas = (
  draw: (context: CanvasRenderingContext2D) => void,
  canvasSize: { width: number; height: number; }
) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        context.clearRect(0, 0, canvasSize.width, canvasSize.height);
        draw(context);
      }
    }
  }, [draw, canvasSize]);

  return ref;
};
