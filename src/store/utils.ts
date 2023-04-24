import { internalsSymbol } from 'utils';

import { getNodePositionWithOrigin } from 'utils/graph';

import { Node, XYZPosition, NodeInternals, NodeOrigin } from 'types';

type ParentNodes = Record<string, boolean>;

function calculateXYZPosition(
   node: Node,
   nodeInternals: NodeInternals,
   result: XYZPosition,
   nodeOrigin: NodeOrigin,
): XYZPosition {
   if (!node.parentNode) {
      return result;
   }
   const parentNode = nodeInternals.get(node.parentNode)!;
   const parentNodePosition = getNodePositionWithOrigin(parentNode, nodeOrigin);

   return calculateXYZPosition(
      parentNode,
      nodeInternals,
      {
         x: (result.x ?? 0) + parentNodePosition.x,
         y: (result.y ?? 0) + parentNodePosition.y,
         z:
            (parentNode[internalsSymbol]?.z ?? 0) > (result.z ?? 0)
               ? parentNode[internalsSymbol]?.z ?? 0
               : result.z ?? 0,
      },
      nodeOrigin,
   );
}

export function updateAbsoluteNodePositions(
   nodeInternals: NodeInternals,
   nodeOrigin: NodeOrigin,
   parentNodes?: ParentNodes,
) {
   nodeInternals.forEach((node) => {
      if (node.parentNode && !nodeInternals.has(node.parentNode)) {
         throw new Error(`Parent node ${node.parentNode} not found`);
      }

      if (node.parentNode || parentNodes?.[node.id]) {
         const { x, y, z } = calculateXYZPosition(
            node,
            nodeInternals,
            {
               ...node.position,
               z: node[internalsSymbol]?.z ?? 0,
            },
            nodeOrigin,
         );

         node.positionAbsolute = {
            x,
            y,
         };

         node[internalsSymbol]!.z = z;

         if (parentNodes?.[node.id]) {
            node[internalsSymbol]!.isParent = true;
         }
      }
   });
}
