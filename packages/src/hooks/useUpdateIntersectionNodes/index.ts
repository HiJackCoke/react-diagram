import { RefObject, useCallback, useRef } from 'react';

import { useStoreApi } from '../useStore';

import { deepEqual } from '../../utils/deepEqual';
import { isParentSelected } from '../useDrag/utils';

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
         const { nodeInternals, triggerNodeChanges } = store.getState();

         const getSplittedNodes = () => {
            const allNodes = Array.from(nodeInternals.values());
            const childNodes = [];

            for (let i = 0; i < allNodes.length; i++) {
               const value = allNodes[i];

               const isChildNode = isParentSelected(value, nodeInternals);
               const isSelectedNode = dragItems.current?.some(
                  (dragItem) => dragItem.id === value.id,
               );

               if (isChildNode) {
                  childNodes.push(value);
               }

               if (isChildNode || isSelectedNode) allNodes.splice(i, 1);
            }

            return {
               childNodes,
               otherNodes: allNodes,
            };
         };

         const { childNodes, otherNodes } = getSplittedNodes();

         console.log(childNodes, otherNodes);

         // isParentSelected
         const intersectedDraggingNodeIds: string[] = [];
         const intersectedNodes: NodeIntersectionChange[] = otherNodes
            .filter((node) => {
               const { width, height, positionAbsolute, parentNode } = node;

               const isChildNode = dragItems.current?.some(
                  (dragItem) => dragItem.id === parentNode,
               );
               if (isChildNode) return;

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
