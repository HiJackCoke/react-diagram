import {
   devWarn,
   getOverlappingArea,
   rectToBox,
   boxToRect,
   getBoundsOfBoxes,
} from '../utils';

import { XYPosition, Rect, Transform } from '@diagram/core';
import { Edge, Connection } from '../types';
import { NodeInternals } from '../store/type';
import { Node } from '../components/Node/type';
import { NodeOrigin } from '../components/Node/utils';
import { EdgeMarker } from '../components/Edges/type';

export const isNode = (element: Node | Connection | Edge): element is Node =>
   'id' in element && !('source' in element) && !('target' in element);

export const isEdge = (element: Node | Connection | Edge): element is Edge =>
   'source' in element && 'target' in element;

export const getNodePositionWithOrigin = (
   node: Node | undefined,
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
   nodeInternals: NodeInternals,
   rect: Rect,
   [tx, ty, tScale]: Transform = [0, 0, 1],
   partially = false,
   excludeNonSelectableNodes = false,
   nodeOrigin: NodeOrigin = [0, 0],
): Node[] => {
   const paneRect = {
      x: (rect.x - tx) / tScale,
      y: (rect.y - ty) / tScale,
      width: rect.width / tScale,
      height: rect.height / tScale,
   };

   const visibleNodes: Node[] = [];

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

export const getMarkerId = (
   marker: EdgeMarker | undefined,
   rfId?: string,
): string => {
   if (typeof marker === 'undefined') {
      return '';
   }

   if (typeof marker === 'string') {
      return marker;
   }

   const idPrefix = rfId ? `${rfId}__` : '';

   return `${idPrefix}${Object.keys(marker)
      .sort()
      .map((key: string) => `${key}=${(marker as any)[key]}`)
      .join('&')}`;
};

const getEdgeId = ({ source, target }: Connection): string =>
   `react-diagram__edge-${source}-${target}`;

const isExistsConnection = (edge: Edge, edges: Edge[]) =>
   edges.some((el) => el.source === edge.source && el.target === edge.target);

export const addEdge = (
   edgeParams: Edge | Connection,
   edges: Edge[],
): Edge[] => {
   if (!isEdge(edgeParams)) {
      devWarn('020');

      return edges;
   }

   if (isExistsConnection(edgeParams, edges)) {
      return edges;
   }

   let edge: Edge;

   if (edgeParams.id) edge = { ...edgeParams };
   else
      edge = {
         ...edgeParams,
         id: getEdgeId(edgeParams),
      };

   return edges.concat(edge);
};

export const updateEdge = (
   originEdge: Edge,
   newConnection: Connection,
   edges: Edge[],
   options = { shouldReplaceId: true },
): Edge[] => {
   const { id: oldEdgeId, ...rest } = originEdge;

   if (!newConnection.source || !newConnection.target) devWarn('020');

   const foundEdge = edges.find((e) => e.id === oldEdgeId) as Edge;

   if (!foundEdge) devWarn('021', oldEdgeId);

   const edge = {
      ...rest,
      id: options.shouldReplaceId ? getEdgeId(newConnection) : oldEdgeId,
      source: newConnection.source,
      target: newConnection.target,
   } as Edge;

   return edges.filter((e) => e.id !== oldEdgeId).concat(edge);
};

export const getRectOfNodes = (
   nodes: Node[],
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
