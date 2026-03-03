import {
   getOverlappingArea,
   rectToBox,
   boxToRect,
   getBoundsOfBoxes,
   clampPosition,
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
   NodeDragItem,
   CoordinateExtent,
   OnBeforeDelete,
   OnDelete,
   TargetElementsOptions,
} from '../types';

type Elements<
   NodeType extends CoreNode = CoreNode,
   EdgeType extends CoreEdge = CoreEdge,
> = { nodes: NodeType[]; edges: EdgeType[] };

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

export function getConnectedEdges<
   NodeType extends CoreNode = CoreNode,
   EdgeType extends CoreEdge = CoreEdge,
>(nodes: Pick<NodeType, 'id'>[], edges: EdgeType[]): EdgeType[] {
   const nodeIds = new Set();
   nodes.forEach((node) => {
      nodeIds.add(node.id);
   });

   return edges.filter(
      (edge) => nodeIds.has(edge.source) || nodeIds.has(edge.target),
   );
}

/**
 * Pass in nodes to select, get arrays of nodes and edges that actually can be selected
 * @internal
 * @param param.elementsToDelete.nodes- The nodes to remove
 * @param param.elementsToDelete.edges- The edges to remove
 * @param param.elements.nodes - All nodes
 * @param param.elements.edges - All edges
 * @returns nodes: nodes that can be selected, edges: edges that can be selected
 */
export function getValidatedConnectedElements<
   NodeType extends CoreNode = CoreNode,
   EdgeType extends CoreEdge = CoreEdge,
>(
   targetElements: TargetElementsOptions<NodeType, EdgeType>,
   elements: Elements<NodeType, EdgeType>,
): Elements<NodeType, EdgeType> {
   const { nodes: targetNodes, edges: targetEdges } = targetElements;
   const { nodes, edges } = elements;

   const matchingNodes: NodeType[] = [];
   const nodeIds = new Set(targetNodes?.map((node) => node.id));

   for (const node of nodes) {
      if (node.deletable === false) {
         continue;
      }

      const isIncluded = nodeIds.has(node.id);
      const parentHit =
         !isIncluded &&
         node.parentNode &&
         matchingNodes.find((n) => n.id === node.parentNode);

      if (isIncluded || parentHit) {
         matchingNodes.push(node);
      }
   }

   const deletableEdges = edges.filter((edge) => edge.deletable !== false);
   const connectedEdges = getConnectedEdges(matchingNodes, edges);
   const matchingEdges: EdgeType[] = connectedEdges;
   const edgeIds = new Set(targetEdges?.map((edge) => edge.id));

   for (const edge of deletableEdges) {
      const isAlreadyMatched = matchingEdges.some((e) => e.id === edge.id);
      const isIncluded = edgeIds.has(edge.id);

      const isValidated = targetEdges
         ? isIncluded && !isAlreadyMatched
         : !isAlreadyMatched;

      if (isValidated) {
         matchingEdges.push(edge);
      }
   }

   return { nodes: matchingNodes, edges: matchingEdges };
}

/**
 * Pass in nodes to delete, get arrays of nodes and edges that actually can be deleted
 * @internal
 * @param param.elementsToDelete.nodes- The nodes to remove
 * @param param.elementsToDelete.edges- The edges to remove
 * @param param.elements.nodes - All nodes
 * @param param.elements.edges - All edges
 * @param param.events.onBeforeDelete - Callback to check which nodes and edges can be deleted
 * @param param.events.onDelete
 * @returns nodes: nodes that can be deleted, edges: edges that can be deleted
 */
export async function validateBeforeDelete<
   NodeType extends CoreNode = CoreNode,
   EdgeType extends CoreEdge = CoreEdge,
>(
   elementsToDelete: TargetElementsOptions<NodeType, EdgeType>,
   elements: Elements<NodeType, EdgeType>,
   events?: {
      onBeforeDelete?: OnBeforeDelete<NodeType, EdgeType>;
      onDelete?: OnDelete<NodeType, EdgeType>;
   },
): Promise<{
   nodes: NodeType[];
   edges: EdgeType[];
}> {
   const { nodes, edges } = elements;
   const { nodes: matchingNodes, edges: matchingEdges } =
      getValidatedConnectedElements(elementsToDelete, { nodes, edges });

   const hasMatchingNodes = matchingNodes.length > 0;
   const hasMatchingEdges = matchingEdges.length > 0;

   function deleteElements() {
      const hasMatchingNodes = matchingNodes.length > 0;
      const hasMatchingEdges = matchingEdges.length > 0;

      if (hasMatchingNodes || hasMatchingEdges) {
         events?.onDelete?.({ nodes: matchingNodes, edges: matchingEdges });
      }
   }

   if (!events?.onBeforeDelete) {
      deleteElements();
      return {
         edges: matchingEdges,
         nodes: matchingNodes,
      };
   }

   const onBeforeDeleteResult = await events?.onBeforeDelete?.({
      nodes: matchingNodes,
      edges: matchingEdges,
   });

   if (typeof onBeforeDeleteResult === 'boolean') {
      if (onBeforeDeleteResult) {
         deleteElements();
      }
      return onBeforeDeleteResult
         ? { edges: matchingEdges, nodes: matchingNodes }
         : { edges: [], nodes: [] };
   }

   return onBeforeDeleteResult;
}
