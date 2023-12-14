import { useCallback } from 'react';

import { useStoreApi } from './useStore';

import { UseDragEvent } from './useDrag/type';
import { GridStep, XYPosition } from '../types';

const convertStepPosition = (
   gridStep: GridStep,
   position: XYPosition,
): XYPosition => ({
   x: gridStep[0] * Math.round(position.x / gridStep[0]),
   y: gridStep[1] * Math.round(position.y / gridStep[1]),
});

export type PointerPosition = XYPosition & {
   getStepPosition?: (position: XYPosition) => XYPosition;
};

function useGetPointerPosition() {
   const store = useStoreApi();

   const getPointerPosition = useCallback(({ sourceEvent }: UseDragEvent) => {
      const { transform, gridStep } = store.getState();
      const x = sourceEvent.touches
         ? sourceEvent.touches[0].clientX
         : sourceEvent.clientX;
      const y = sourceEvent.touches
         ? sourceEvent.touches[0].clientY
         : sourceEvent.clientY;

      const pointerPos = {
         x: (x - transform[0]) / transform[2],
         y: (y - transform[1]) / transform[2],
      };

      const getStepPosition = (position: XYPosition = pointerPos) =>
         gridStep ? convertStepPosition(gridStep, position) : position;

      return {
         getStepPosition,
         ...pointerPos,
      };
   }, []);

   return getPointerPosition;
}

export default useGetPointerPosition;
