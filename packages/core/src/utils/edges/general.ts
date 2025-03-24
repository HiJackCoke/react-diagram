import { devWarn } from '../general';
import { isCoreEdge } from '../graph';

import { Connection, CoreEdge } from '../../types';

export const getEdgeCenter = ({
   sourceX,
   sourceY,
   targetX,
   targetY,
}: {
   sourceX: number;
   sourceY: number;
   targetX: number;
   targetY: number;
}): [number, number, number, number] => {
   const xOffset = Math.abs(targetX - sourceX) / 2;
   const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

   const yOffset = Math.abs(targetY - sourceY) / 2;
   const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

   return [centerX, centerY, xOffset, yOffset];
};

const getEdgeId = ({ source, target }: CoreEdge | Connection): string =>
   `react-diagram__edge-${source}-${target}`;

const isExistsConnection = (edge: CoreEdge, edges: CoreEdge[]) =>
   edges.some(
      (el) =>
         el.source === edge.source &&
         el.target === edge.target &&
         (el.sourcePort === edge.sourcePort ||
            (!el.sourcePort && !edge.sourcePort)) &&
         (el.targetPort === edge.targetPort ||
            (!el.targetPort && !edge.targetPort)),
   );

export const addEdge = (
   edgeParams: CoreEdge | Connection,
   edges: CoreEdge[],
): CoreEdge[] => {
   if (!isCoreEdge(edgeParams)) {
      devWarn('020');

      return edges;
   }

   if (isExistsConnection(edgeParams, edges)) {
      return edges;
   }

   let edge: CoreEdge;

   if (edgeParams.sourcePort === null) {
      delete edgeParams.sourcePort;
   }

   if (edgeParams.targetPort === null) {
      delete edgeParams.targetPort;
   }

   if (edgeParams.id) edge = { ...edgeParams };
   else
      edge = {
         ...edgeParams,
         id: getEdgeId(edgeParams),
      };

   return edges.concat(edge);
};

export const updateEdge = (
   originEdge: CoreEdge,
   newConnection: Connection,
   edges: CoreEdge[],
   options = { shouldReplaceId: true },
): CoreEdge[] => {
   const { id: oldEdgeId, ...rest } = originEdge;

   if (!newConnection.source || !newConnection.target) devWarn('020');

   const foundEdge = edges.find((e) => e.id === oldEdgeId) as CoreEdge;

   if (!foundEdge) devWarn('021', oldEdgeId);

   const edge = {
      ...rest,
      id: options.shouldReplaceId ? getEdgeId(newConnection) : oldEdgeId,
      source: newConnection.source,
      target: newConnection.target,
   } as CoreEdge;

   return edges.filter((e) => e.id !== oldEdgeId).concat(edge);
};
