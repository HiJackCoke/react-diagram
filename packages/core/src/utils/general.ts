import { ErrorMessageCode, errorMessages } from '../fixtures/errorMessages';
import { Box, CoordinateExtent, Dimensions, Rect, XYPosition } from '../types';

export const clamp = (val: number, min = 0, max = 1): number =>
   Math.min(Math.max(val, min), max);

const calcAutoPanVelocity = (
   value: number,
   bound: number,
   radius: number,
   velocity: number,
): number => {
   const maxRadius = bound - radius;
   if (value < radius) {
      return (clamp(Math.abs(value - radius), 1, 50) / 50) * velocity;
   } else if (value > maxRadius) {
      return (-clamp(Math.abs(value - maxRadius), 1, 50) / 50) * velocity;
   }

   return 0;
};

export const calcAutoPanPosition = (
   pos: XYPosition,
   bounds: Dimensions,
): number[] => {
   const xMovement = calcAutoPanVelocity(pos.x, bounds.width, 30, 10);
   const yMovement = calcAutoPanVelocity(pos.y, bounds.height, 30, 10);

   return [xMovement, yMovement];
};

export const devWarn = (id: ErrorMessageCode, value = '') => {
   if (process.env.NODE_ENV === 'development') {
      console.warn(`[React Diagram]: ${id}-${errorMessages[id](value)}`);
   }
};

export const rectToBox = ({ x, y, width, height }: Rect): Box => ({
   x,
   y,
   x2: x + width,
   y2: y + height,
});

export const boxToRect = ({ x, y, x2, y2 }: Box): Rect => ({
   x,
   y,
   width: x2 - x,
   height: y2 - y,
});

export const getBoundsOfBoxes = (box1: Box, box2: Box): Box => ({
   x: Math.min(box1.x, box2.x),
   y: Math.min(box1.y, box2.y),
   x2: Math.max(box1.x2, box2.x2),
   y2: Math.max(box1.y2, box2.y2),
});

export const isNumeric = (n: any): n is number => !isNaN(n) && isFinite(n);

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

export const clampPosition = (
   position: XYPosition = { x: 0, y: 0 },
   extent: CoordinateExtent,
) => ({
   x: clamp(position.x, extent[0][0], extent[1][0]),
   y: clamp(position.y, extent[0][1], extent[1][1]),
});
