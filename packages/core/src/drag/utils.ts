import { CoreNode, NodeInternals } from '../types';

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
