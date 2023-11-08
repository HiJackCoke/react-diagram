import {
   MouseEvent as ReactMouseEvent,
   TouchEvent as ReactTouchEvent,
} from 'react';

import { ErrorMessageCode, errorMessages } from '../fixtures/errorMessages';

import {
   Dimensions,
   Rect,
   XYPosition,
   CoordinateExtent,
   Box,
   OnError,
} from '../types';

export const internalsSymbol = Symbol.for('internals');

export const devWarn = (id: ErrorMessageCode, value = '') => {
   if (process.env.NODE_ENV === 'development') {
      console.warn(`[React Diagram]: ${id}-${errorMessages[id](value)}`);
   }
};

export const onErrorWrapper =
   (onError?: OnError) =>
   (id: keyof typeof errorMessages, value = '') =>
      onError?.(id, errorMessages[id](value));

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

export const boxToRect = ({ x, y, x2, y2 }: Box): Rect => ({
   x,
   y,
   width: x2 - x,
   height: y2 - y,
});

export const isMouseEvent = (
   event: MouseEvent | ReactMouseEvent | TouchEvent | ReactTouchEvent,
): event is MouseEvent | ReactMouseEvent => 'clientX' in event;

export const getEventPosition = (
   event: MouseEvent | ReactMouseEvent | TouchEvent | ReactTouchEvent,
   bounds?: DOMRect,
) => {
   const isMouseTriggered = isMouseEvent(event);
   const evtX = isMouseTriggered ? event.clientX : event.touches?.[0].clientX;
   const evtY = isMouseTriggered ? event.clientY : event.touches?.[0].clientY;

   return {
      x: evtX - (bounds?.left ?? 0),
      y: evtY - (bounds?.top ?? 0),
   };
};

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
