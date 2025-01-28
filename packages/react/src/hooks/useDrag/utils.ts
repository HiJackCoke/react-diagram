import { getNodePositionWithOrigin } from '../../utils/graph';
import { clampPosition } from '../../utils';

import type {
   XYPosition,
   CoordinateExtent,
   NodeInternals,
   CoreNode,
   NodeDragItem,
} from '@diagram/core';

import { NodeOrigin } from '../../components/Node/utils';

export const calcNextPosition = (
   node: NodeDragItem | CoreNode,
   nextPosition: XYPosition,
   nodeInternals: NodeInternals<CoreNode>,
   nodeExtent?: CoordinateExtent,
   nodeOrigin: NodeOrigin = [0, 0],
): { position: XYPosition; positionAbsolute: XYPosition } => {
   let currentExtent = node.extent || nodeExtent;

   if (node.extent && node.parentNode) {
      const parent = nodeInternals.get(node.parentNode);
      const { x: parentX, y: parentY } = getNodePositionWithOrigin(
         parent,
         nodeOrigin,
      ).positionAbsolute;
      currentExtent = [
         [node.extent[0][0] + parentX, node.extent[0][1] + parentY],
         [node.extent[1][0] + parentX, node.extent[1][1] + parentY],
      ];
   }

   let parentPosition = { x: 0, y: 0 };

   if (node.parentNode) {
      const parentNode = nodeInternals.get(node.parentNode);
      parentPosition = getNodePositionWithOrigin(
         parentNode,
         nodeOrigin,
      ).positionAbsolute;
   }

   const positionAbsolute = currentExtent
      ? clampPosition(nextPosition, currentExtent as CoordinateExtent)
      : nextPosition;

   return {
      position: {
         x: positionAbsolute.x - parentPosition.x,
         y: positionAbsolute.y - parentPosition.y,
      },
      positionAbsolute,
   };
};

export const getEventHandlerParams = ({
   nodeId,
   dragItems,
   nodeInternals,
}: {
   nodeId?: string;
   dragItems: NodeDragItem[];
   nodeInternals: NodeInternals<CoreNode>;
}): [CoreNode, CoreNode[]] => {
   const extentedDragItems: CoreNode[] = dragItems.map((n) => {
      const node = nodeInternals.get(n.id)!;

      return {
         ...node,
         position: n.position,
         positionAbsolute: n.positionAbsolute,
      };
   });

   return [
      nodeId
         ? extentedDragItems.find((n) => n.id === nodeId)!
         : extentedDragItems[0],
      extentedDragItems,
   ];
};
