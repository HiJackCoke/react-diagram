import { Dimensions, Rect } from 'types';

export const internalsSymbol = Symbol.for('internals');

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
