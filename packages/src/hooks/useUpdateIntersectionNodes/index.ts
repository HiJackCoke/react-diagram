import { RefObject, useCallback, useRef } from 'react';

import { useStoreApi } from '../useStore';

import { deepEqual } from '../../utils/deepEqual';

import { Node } from '../../types';
import { NodeDragItem } from '../useDrag/type';
import { NodeIntersectionChange } from '../../types';

function useUpdateIntersectionNodes() {
   const store = useStoreApi();

   const intersectionChanges = useRef<NodeIntersectionChange[]>([]);

   const resetIntersectedNodes = useCallback(
      (intersectedNodes: NodeIntersectionChange[]) => {
         const hasIntersectedNodes = intersectedNodes.length;

         let beforeChanges;

         if (hasIntersectedNodes) {
            beforeChanges = intersectionChanges.current
               .filter((beforeChange) => {
                  return !intersectedNodes.some(
                     (intersectedNode) =>
                        beforeChange.id === intersectedNode.id,
                  );
               })
               .map((beforeChange) => ({
                  ...beforeChange,
                  intersected: false,
               }));
         } else {
            beforeChanges = intersectionChanges.current.map((beforeChange) => ({
               ...beforeChange,
               intersected: false,
            }));
         }

         return beforeChanges;
      },
      [],
   );

   const updateNodesIntersection = useCallback(
      (dragItems: RefObject<Node[] | NodeDragItem[]>) => {
         const { gridStep, getNodes, triggerNodeChanges } = store.getState();

         if (gridStep) return;

         const changes: NodeIntersectionChange[] = getNodes()
            .filter((node) => {
               const { width, height, position, parentNode } = node;

               if (parentNode) return;
               if (width && height) {
                  return dragItems.current?.some((dragItem) => {
                     const {
                        position: dPosition,
                        width: dWidth,
                        height: dHeight,
                     } = dragItem;

                     if (node.id === dragItem.id) return;
                     if (dragItem.parentNode) return;
                     if (!dWidth || !dHeight) return;

                     const leftIn = dPosition.x + dWidth >= position.x;
                     const rightIn = position.x + width >= dPosition.x;
                     const topIn = dPosition.y + dHeight >= position.y;
                     const bottomIn = position.y + height >= dPosition.y;

                     return leftIn && rightIn && topIn && bottomIn;
                  });
               }
            })
            .map((node) => {
               return {
                  id: node.id,
                  type: 'intersect',
                  intersected: true,
               };
            });

         if (!deepEqual(changes, intersectionChanges.current)) {
            const beforeChanges = resetIntersectedNodes(changes);

            intersectionChanges.current = changes;

            triggerNodeChanges([...changes, ...beforeChanges]);
         }
      },
      [],
   );

   return updateNodesIntersection;
}

export default useUpdateIntersectionNodes;
