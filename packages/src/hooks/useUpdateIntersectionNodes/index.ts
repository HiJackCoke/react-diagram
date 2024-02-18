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
         const { getNodes, triggerNodeChanges } = store.getState();

         const intersectedDraggingNodeIds: string[] = [];
         const intersectedNodes: NodeIntersectionChange[] = getNodes()
            .filter((node) => {
               const { width, height, positionAbsolute, parentNode } = node;

               if (parentNode) return;

               if (width && height) {
                  return dragItems.current?.some((dragItem) => {
                     const {
                        positionAbsolute: dPositionAbsolute,
                        width: dWidth,
                        height: dHeight,
                     } = dragItem;

                     if (node.id === dragItem.id) return;
                     // if (dragItem.parentNode) return;
                     if (!dWidth || !dHeight) return;

                     const leftIn =
                           dPositionAbsolute.x + dWidth >= positionAbsolute.x,
                        rightIn =
                           positionAbsolute.x + width >= dPositionAbsolute.x,
                        topIn =
                           dPositionAbsolute.y + dHeight >= positionAbsolute.y,
                        bottomIn =
                           positionAbsolute.y + height >= dPositionAbsolute.y;

                     const isIn = leftIn && rightIn && topIn && bottomIn;

                     if (isIn) {
                        if (!intersectedDraggingNodeIds.includes(dragItem.id)) {
                           intersectedDraggingNodeIds.push(dragItem.id);
                        }
                     }
                     return isIn;
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

         const intersectedDraggingNodes: NodeIntersectionChange[] =
            intersectedDraggingNodeIds.map((id) => {
               return {
                  id,
                  type: 'intersect',
                  intersected: true,
               };
            });

         const changes = [...intersectedNodes, ...intersectedDraggingNodes];

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
