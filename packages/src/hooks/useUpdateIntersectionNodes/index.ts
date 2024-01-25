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

         const changes: NodeIntersectionChange[] = [];
         const changeIds: string[] = [];

         dragItems.current?.forEach((dragItem) => {
            if (dragItem.parentNode) return;
            if (dragItem.width && dragItem.height) {
               const { position, width, height } = dragItem;

               const changeNodes: NodeIntersectionChange[] = getNodes()
                  .filter((node) => {
                     if (changeIds.includes(node.id)) return;
                     if (!node.width || !node.height) return;
                     if (node.id === dragItem.id) return;
                     if (node.parentNode) return;

                     const { position: nodePosition } = node;

                     const leftIn = position.x + width >= nodePosition.x;
                     const rightIn = nodePosition.x + node.width >= position.x;
                     const topIn = position.y + height >= nodePosition.y;
                     const bottomIn =
                        nodePosition.y + node.height >= position.y;

                     return leftIn && rightIn && topIn && bottomIn;
                  })
                  .map((node) => {
                     changeIds.push(node.id);

                     return {
                        id: node.id,
                        type: 'intersect',
                        intersected: true,
                     };
                  });

               changes.push(...changeNodes);
            }
         });

         if (deepEqual(changes, intersectionChanges.current)) {
            triggerNodeChanges(changes);
         } else {
            console.log('deepEqul');

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
