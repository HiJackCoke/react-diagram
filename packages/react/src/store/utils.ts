import {
   internalsSymbol,
   isNumeric,
   getNodePositionWithOrigin,
} from '@diagram/core';
import type { NodeInternals, XYZPosition } from '@diagram/core';

import { Node } from '../components/Node/type';
import { NodeOrigin } from '../components/Node/utils';

type ParentNodes = Record<string, boolean>;

function calculateXYZPosition(
   node: Node,
   nodeInternals: NodeInternals<Node>,
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
   nodeInternals: NodeInternals<Node>,
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

export function createNodeInternals(
   nodes: Node[],
   nodeInternals: NodeInternals<Node>,
   nodeOrigin: NodeOrigin,
   elevateNodesOnSelect: boolean,
): NodeInternals<Node> {
   const nextNodeInternals = new Map<string, Node>();
   const parentNodes: ParentNodes = {};
   const selectedNodeZ: number = elevateNodesOnSelect ? 1000 : 0;

   nodes.forEach((node) => {
      const z =
         (isNumeric(node.zIndex) ? node.zIndex : 0) +
         (node.selected ? selectedNodeZ : 0);
      const currInternals = nodeInternals.get(node.id);

      const internals: Node = {
         width: currInternals?.width,
         height: currInternals?.height,
         ...node,
         positionAbsolute: {
            x: node.position.x,
            y: node.position.y,
         },
      };

      if (node.parentNode) {
         internals.parentNode = node.parentNode;
         parentNodes[node.parentNode] = true;
      }

      Object.defineProperty(internals, internalsSymbol, {
         enumerable: false,
         value: {
            portBounds: currInternals?.[internalsSymbol]?.portBounds,
            z,
         },
      });

      nextNodeInternals.set(node.id, internals);
   });

   updateAbsoluteNodePositions(nextNodeInternals, nodeOrigin, parentNodes);

   return nextNodeInternals;
}

export const isIntersected = (
   targetNode: Node,
   nodeInternals: NodeInternals<Node>,
): boolean => {
   const { id, width, height, positionAbsolute } = targetNode;

   if (!width || !height) return false;

   let intersected = false;
   for (const [key, sourceNode] of nodeInternals) {
      if (id === key) continue;

      const {
         positionAbsolute: sPositionAbsolute,
         width: sWidth,
         height: sHeight,
      } = sourceNode;

      if (!sWidth || !sHeight) continue;
      if (!sPositionAbsolute || !positionAbsolute) continue;

      // if (sourceNode.parentNode === targetNode.id) continue;
      // if (targetNode.parentNode === sourceNode.id) continue;

      const leftIn = sPositionAbsolute.x + sWidth >= positionAbsolute.x,
         rightIn = positionAbsolute.x + width >= sPositionAbsolute.x,
         topIn = sPositionAbsolute.y + sHeight >= positionAbsolute.y,
         bottomIn = positionAbsolute.y + height >= sPositionAbsolute.y;

      const isIn = leftIn && rightIn && topIn && bottomIn;

      if (isIn) {
         intersected = true;
         break;
      }
   }

   return intersected;
};
