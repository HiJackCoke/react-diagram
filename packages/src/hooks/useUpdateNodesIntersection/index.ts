import { useCallback, useRef } from 'react';

import { useStoreApi } from '../useStore';

import { deepEqual } from '../../utils/deepEqual';

import { Node } from '../../types';
import { NodeIntersectionChange } from '../../types';
import { NodeInternals } from '../../store/type';

function useUpdateNodesIntersection() {
   const store = useStoreApi();

   const intersectionChanges = useRef<NodeIntersectionChange[]>([]);

   const isIntersected = useCallback(
      (node: Node, nodeInternals: NodeInternals) => {
         const allNodes = Array.from(nodeInternals.values());
         const { id, width, height, positionAbsolute } = node;

         if (!width || !height) return;

         return allNodes.some((compareNode) => {
            if (id === compareNode.id) return;

            const {
               positionAbsolute: dPositionAbsolute,
               width: dWidth,
               height: dHeight,
            } = compareNode;

            if (!dWidth || !dHeight) return;

            const leftIn = dPositionAbsolute.x + dWidth >= positionAbsolute.x,
               rightIn = positionAbsolute.x + width >= dPositionAbsolute.x,
               topIn = dPositionAbsolute.y + dHeight >= positionAbsolute.y,
               bottomIn = positionAbsolute.y + height >= dPositionAbsolute.y;

            const isIn = leftIn && rightIn && topIn && bottomIn;

            return isIn;
         });
      },
      [],
   );

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

   const updateNodesIntersection = useCallback(() => {
      const { nodeInternals, triggerNodeChanges } = store.getState();

      const getIntersectedNodes = (): NodeIntersectionChange[] => {
         const allNodes = Array.from(nodeInternals.values());

         const intersectedNodes: NodeIntersectionChange[] = allNodes
            .filter((filterNode) => {
               const { width, height } = filterNode;

               if (!width || !height) return;

               return isIntersected(filterNode, nodeInternals);
            })
            .map((node) => {
               return {
                  id: node.id,
                  type: 'intersect',
                  intersected: true,
               };
            });

         return intersectedNodes;
      };

      const changes = getIntersectedNodes();

      if (!deepEqual(changes, intersectionChanges.current)) {
         const beforeChanges = resetIntersectedNodes(changes);

         intersectionChanges.current = changes;

         triggerNodeChanges([...changes, ...beforeChanges]);
      }
   }, []);

   return updateNodesIntersection;
}

export default useUpdateNodesIntersection;
