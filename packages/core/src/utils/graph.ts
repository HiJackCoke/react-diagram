import {
   getOverlappingArea,
   rectToBox,
   boxToRect,
   getBoundsOfBoxes,
} from './general';
import type {
   XYPosition,
   Rect,
   Transform,
   Connection,
   NodeInternals,
   CoreEdge,
   CoreNode,
   NodeOrigin,
} from '../types';

export const isCoreNode = (
   element: CoreNode | Connection | CoreEdge,
): element is CoreNode =>
   'id' in element && !('source' in element) && !('target' in element);

export const isCoreEdge = (
   element: CoreNode | Connection | CoreEdge,
): element is CoreEdge => 'source' in element && 'target' in element;

export const getNodePositionWithOrigin = (
   node: CoreNode | undefined,
   nodeOrigin: NodeOrigin = [0, 0],
): XYPosition & { positionAbsolute: XYPosition } => {
   if (!node) {
      return {
         x: 0,
         y: 0,
         positionAbsolute: {
            x: 0,
            y: 0,
         },
      };
   }

   const offsetX = (node.width ?? 0) * nodeOrigin[0];
   const offsetY = (node.height ?? 0) * nodeOrigin[1];

   const position: XYPosition = {
      x: node.position.x - offsetX,
      y: node.position.y - offsetY,
   };

   return {
      ...position,
      positionAbsolute: node.positionAbsolute
         ? {
              x: node.positionAbsolute.x - offsetX,
              y: node.positionAbsolute.y - offsetY,
           }
         : position,
   };
};

export const getNodesInside = (
   nodeInternals: NodeInternals<CoreNode>,
   rect: Rect,
   [tx, ty, tScale]: Transform = [0, 0, 1],
   partially = false,
   excludeNonSelectableNodes = false,
   nodeOrigin: NodeOrigin = [0, 0],
): CoreNode[] => {
   const paneRect = {
      x: (rect.x - tx) / tScale,
      y: (rect.y - ty) / tScale,
      width: rect.width / tScale,
      height: rect.height / tScale,
   };

   const visibleNodes: CoreNode[] = [];

   nodeInternals.forEach((node) => {
      const { width, height, selectable = true, hidden = false } = node;

      if ((excludeNonSelectableNodes && !selectable) || hidden) {
         return false;
      }

      const { positionAbsolute } = getNodePositionWithOrigin(node, nodeOrigin);

      const nodeRect = {
         x: positionAbsolute.x,
         y: positionAbsolute.y,
         width: width || 0,
         height: height || 0,
      };
      const overlappingArea = getOverlappingArea(paneRect, nodeRect);
      const notInitialized =
         typeof width === 'undefined' ||
         typeof height === 'undefined' ||
         width === null ||
         height === null;

      const partiallyVisible = partially && overlappingArea > 0;
      const area = (width || 0) * (height || 0);
      const isVisible =
         notInitialized || partiallyVisible || overlappingArea >= area;

      if (isVisible || node.dragging) {
         visibleNodes.push(node);
      }
   });

   return visibleNodes;
};

export const getRectOfNodes = (
   nodes: CoreNode[],
   nodeOrigin: NodeOrigin = [0, 0],
): Rect => {
   if (nodes.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
   }

   const box = nodes.reduce(
      (currentBox, node) => {
         const { x, y } = getNodePositionWithOrigin(
            node,
            nodeOrigin,
         ).positionAbsolute;

         const nextBox = rectToBox({
            x,
            y,
            width: node.width || 0,
            height: node.height || 0,
         });

         return getBoundsOfBoxes(currentBox, nextBox);
      },
      { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity },
   );

   return boxToRect(box);
};
