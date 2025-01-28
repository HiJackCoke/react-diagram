import { CoreNode, NodeDragItem, NodeInternals, XYPosition } from '../types';

export const isParentSelected = <NodeType extends CoreNode>(
   node: NodeType,
   nodeInternals: NodeInternals<NodeType>,
): boolean => {
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
};

export const hasSelector = (
   target: Element,
   selector: string,
   domNode: Element,
): boolean => {
   let current = target;

   do {
      if (current?.matches(selector)) return true;
      if (current === domNode) return false;
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

export const getDragItems = (
   nodeInternals: NodeInternals<CoreNode>,
   nodesDraggable: boolean,
   mousePosition: XYPosition,
   nodeId?: string,
): NodeDragItem[] => {
   const filteredNode = Array.from(nodeInternals.values()).filter((n) => {
      const hasSize = n.width && n.height;
      const isSelected = n.selected || n.id === nodeId;
      const hasNoParent = !n.parentNode || !isParentSelected(n, nodeInternals);
      const isDraggable =
         n.draggable || (nodesDraggable && typeof n.draggable === 'undefined');

      return hasSize && isSelected && hasNoParent && isDraggable;
   });

   return filteredNode.map((n) => ({
      id: n.id,
      position: n.position || { x: 0, y: 0 },
      positionAbsolute: n.positionAbsolute || { x: 0, y: 0 },
      distance: {
         x: mousePosition.x - (n.positionAbsolute?.x ?? 0),
         y: mousePosition.y - (n.positionAbsolute?.y ?? 0),
      },
      extent: n.extent,
      parentNode: n.parentNode,
      width: n.width || 0,
      height: n.height || 0,
   }));
};

