import { RefObject, useEffect, useRef, useState } from 'react';

import { CosmosDrag } from '@diagram/core';
import type { DragInstance, DragUpdateParams } from '@diagram/core';

import { useStoreApi } from './useStore';

import { handleNodeClick } from '../components/Node/utils';

type UseDragParams = Omit<DragUpdateParams, 'domNode'> & {
   nodeRef: RefObject<HTMLDivElement>;
   disabled?: boolean;
};

const useDrag = ({
   disabled,
   nodeRef,
   nodeId,
   isSelectable,
   noDragClassName,
}: UseDragParams) => {
   const store = useStoreApi();

   const rdDrag = useRef<DragInstance>();

   const [dragging, setDragging] = useState<boolean>(false);

   useEffect(() => {
      rdDrag.current = CosmosDrag({
         getStore: () => store.getState(),
         onNodeMouseDown: (id: string) => {
            handleNodeClick({
               id,
               store,
               nodeRef,
            });
         },
         onDragStart: () => {
            setDragging(true);
         },
         onDragEnd: () => {
            setDragging(false);
         },
      });
   }, []);

   useEffect(() => {
      if (disabled) {
         rdDrag.current?.destroy();
      } else if (nodeRef.current) {
         rdDrag.current?.update({
            noDragClassName,

            domNode: nodeRef.current,
            isSelectable,
            nodeId,
         });
         return () => {
            rdDrag.current?.destroy();
         };
      }
   }, [noDragClassName, disabled, isSelectable, nodeRef, nodeId]);

   return dragging;
};

export default useDrag;
