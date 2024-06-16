import { Dimensions, XYPosition } from '../types';

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
