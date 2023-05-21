import { Dimensions, Rect, XYPosition, CoordinateExtent, Box } from 'types';

export const internalsSymbol = Symbol.for('internals');

export const devWarn = (id: string, message: string) => {
   if (process.env.NODE_ENV === 'development') {
      console.warn(`[React Diagram]: ${id}-${message}`);
   }
};

export const isNumeric = (n: any): n is number => !isNaN(n) && isFinite(n);

export const getDimensions = (node: HTMLDivElement): Dimensions => ({
   width: node.offsetWidth,
   height: node.offsetHeight,
});

export const getOverlappingArea = (rectA: Rect, rectB: Rect): number => {
   const xOverlap = Math.max(
      0,
      Math.min(rectA.x + rectA.width, rectB.x + rectB.width) -
         Math.max(rectA.x, rectB.x),
   );
   const yOverlap = Math.max(
      0,
      Math.min(rectA.y + rectA.height, rectB.y + rectB.height) -
         Math.max(rectA.y, rectB.y),
   );

   return Math.ceil(xOverlap * yOverlap);
};

export const clamp = (val: number, min = 0, max = 1): number =>
   Math.min(Math.max(val, min), max);

export const clampPosition = (
   position: XYPosition = { x: 0, y: 0 },
   extent: CoordinateExtent,
) => ({
   x: clamp(position.x, extent[0][0], extent[1][0]),
   y: clamp(position.y, extent[0][1], extent[1][1]),
});

export const rectToBox = ({ x, y, width, height }: Rect): Box => ({
   x,
   y,
   x2: x + width,
   y2: y + height,
});
