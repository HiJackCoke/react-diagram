import { RefObject } from 'react';
import { getNodePositionWithOrigin } from '../../utils/graph';
import { isNumeric, clampPosition } from '../../utils';

import { XYPosition, CoordinateExtent, OnError } from '../../types';

import { NodeInternals } from '../../store/type';
import { Node } from '../../components/Node/type';
import { NodeOrigin } from '../../components/Node/utils';
import { NodeDragItem } from './type';

export function isParentSelected(
   node: Node,
   nodeInternals: NodeInternals,
): boolean {
   if (!node.parentNode) {
      return false;
   }

   const parentNode = nodeInternals.get(node.parentNode);

   if (!parentNode) {
      return false;
   }

   if (parentNode.selected) {
      return true;
   }

   return isParentSelected(parentNode, nodeInternals);
}

export const getDragItems = (
   nodeInternals: NodeInternals,
   nodesDraggable: boolean,
   mousePosition: XYPosition,
   nodeId?: string,
): NodeDragItem[] => {
   return Array.from(nodeInternals.values())
      .filter(
         (n) =>
            (n.selected || n.id === nodeId) &&
            (!n.parentNode || !isParentSelected(n, nodeInternals)) &&
            (n.draggable ||
               (nodesDraggable && typeof n.draggable === 'undefined')),
      )
      .map((n) => ({
         id: n.id,
         position: n.position || { x: 0, y: 0 },
         positionAbsolute: n.positionAbsolute || { x: 0, y: 0 },
         distance: {
            x: mousePosition.x - (n.positionAbsolute?.x ?? 0),
            y: mousePosition.y - (n.positionAbsolute?.y ?? 0),
         },
         delta: {
            x: 0,
            y: 0,
         },
         extent: n.extent,
         parentNode: n.parentNode,
         width: n.width,
         height: n.height,
      }));
};

export const calcNextPosition = (
   node: NodeDragItem | Node,
   nextPosition: XYPosition,
   nodeInternals: NodeInternals,
   nodeExtent?: CoordinateExtent,
   nodeOrigin: NodeOrigin = [0, 0],
   onError?: OnError,
): { position: XYPosition; positionAbsolute: XYPosition } => {
   let currentExtent = node.extent || nodeExtent;

   if (node.extent === 'parent') {
      if (node.parentNode && node.width && node.height) {
         const parent = nodeInternals.get(node.parentNode);
         const { x: parentX, y: parentY } = getNodePositionWithOrigin(
            parent,
            nodeOrigin,
         ).positionAbsolute;
         currentExtent =
            parent &&
            isNumeric(parentX) &&
            isNumeric(parentY) &&
            isNumeric(parent.width) &&
            isNumeric(parent.height)
               ? [
                    [
                       parentX + node.width * nodeOrigin[0],
                       parentY + node.height * nodeOrigin[1],
                    ],
                    [
                       parentX +
                          parent.width -
                          node.width +
                          node.width * nodeOrigin[0],
                       parentY +
                          parent.height -
                          node.height +
                          node.height * nodeOrigin[1],
                    ],
                 ]
               : currentExtent;
      } else {
         onError?.('011');

         currentExtent = nodeExtent;
      }
   } else if (node.extent && node.parentNode) {
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
   nodeInternals: NodeInternals;
}): [Node, Node[]] => {
   const extentedDragItems: Node[] = dragItems.map((n) => {
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

export const hasSelector = (
   target: Element,
   selector: string,
   nodeRef: RefObject<Element>,
): boolean => {
   let current = target;

   do {
      if (current?.matches(selector)) return true;
      if (current === nodeRef.current) return false;
      current = current.parentElement as Element;
   } while (current);

   return false;
};

export const hasChangedPosition = (
   beforePositions: XYPosition,
   currentPosition: XYPosition,
): boolean =>
   beforePositions.x !== currentPosition.x ||
   beforePositions.y !== currentPosition.y;
