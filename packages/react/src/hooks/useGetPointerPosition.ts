import { useCallback } from 'react';

import { Transform, XYPosition, getEventPosition } from '@diagram/core';

import { pointToRendererPoint } from '../components/Port/utils';
import { GridStep } from '../types';

type NodeSize = {
   width: number;
   height: number;
};

type StepPositionParams = {
   position: XYPosition;
   nodeSize?: NodeSize;
};

type GetStepPosition = (params?: StepPositionParams) => XYPosition;

export type PointerPosition = XYPosition & {
   getStepPosition?: GetStepPosition;
};

export type GetPointerPositionParams = {
   transform: Transform;
   gridStep?: GridStep;
   centerStep?: boolean;
};

function useGetPointerPosition() {
   const getPointerPosition = useCallback(
      (
         event: MouseEvent | TouchEvent,
         { transform, gridStep, centerStep }: GetPointerPositionParams,
      ) => {
         const { x, y } = getEventPosition(event);

         const pointerPos = pointToRendererPoint({ x, y }, transform);

         const getStepPosition: GetStepPosition = (
            params = {
               position: pointerPos,
            },
         ) => {
            const { position, nodeSize } = params;

            if (!gridStep) return position;

            let x = gridStep[0] * Math.round(position.x / gridStep[0]),
               y = gridStep[1] * Math.round(position.y / gridStep[1]);

            if (centerStep && nodeSize) {
               const centerX = (gridStep[0] - nodeSize.width) / 2;
               const centerY = (gridStep[1] - nodeSize.height) / 2;

               const positionX = position.x - centerX;
               const positionY = position.y - centerY;

               x = gridStep[0] * Math.round(positionX / gridStep[0]) + centerX;
               y = gridStep[1] * Math.round(positionY / gridStep[1]) + centerY;
            }

            return {
               x,
               y,
            };
         };

         return {
            getStepPosition,
            ...pointerPos,
         };
      },
      [],
   );

   return getPointerPosition;
}

export default useGetPointerPosition;
