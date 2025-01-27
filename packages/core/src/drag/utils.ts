import { CoreNode, NodeInternals, XYPosition } from '../types';

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
