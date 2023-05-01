import { useCallback } from 'react';

import { useStoreApi } from './useStore';
import type { UseDragEvent } from '../types';

function useGetPointerPosition() {
   const store = useStoreApi();

   // returns the pointer position projected to the RF coordinate system
   const getPointerPosition = useCallback(({ sourceEvent }: UseDragEvent) => {
      const { transform } = store.getState();
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

      // we need the snapped position in order to be able to skip unnecessary drag events
      return {
         xSnapped: pointerPos.x,
         ySnapped: pointerPos.y,
         ...pointerPos,
      };
   }, []);

   return getPointerPosition;
}

export default useGetPointerPosition;
