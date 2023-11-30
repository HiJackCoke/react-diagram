import { useCallback } from 'react';

import { useStoreApi } from './useStore';

import { getStepPosition } from './useDrag/utils';

import { UseDragEvent } from './useDrag/type';

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

      if (gridStep) {
         const { x: stepX, y: stepY } = getStepPosition(gridStep, pointerPos);

         return {
            stepX: stepX,
            stepY: stepY,
            ...pointerPos,
         };
      }

      return {
         stepX: pointerPos.x,
         stepY: pointerPos.y,
         ...pointerPos,
      };
   }, []);

   return getPointerPosition;
}

export default useGetPointerPosition;
