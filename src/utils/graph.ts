import { Node, NodeOrigin, XYPosition } from 'types';

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
