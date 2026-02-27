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

const getEdgeId = ({
   source,
   sourcePort,
   target,
   targetPort,
}: CoreEdge | Connection): string =>
   `react-diagram__edge-${source}${sourcePort}-${target}${targetPort}`;

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

export const addEdge = <EdgeType extends CoreEdge = CoreEdge>(
   edgeParams: EdgeType | Connection,
   edges: EdgeType[],
): EdgeType[] => {
   if (!isCoreEdge(edgeParams)) {
      devWarn('020');

      return edges;
   }

   if (isExistsConnection(edgeParams, edges)) {
      return edges;
   }

   let edge: EdgeType;

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

export const updateEdge = <EdgeType extends CoreEdge = CoreEdge>(
   originEdge: EdgeType,
   newConnection: Connection,
   edges: EdgeType[],
   options = { shouldReplaceId: true },
): EdgeType[] => {
   const { id: oldEdgeId, ...rest } = originEdge;

   if (!newConnection.source || !newConnection.target) devWarn('020');

   const foundEdge = edges.find((e) => e.id === oldEdgeId) as EdgeType;

   if (!foundEdge) devWarn('021', oldEdgeId);

   const edge = {
      ...rest,
      id: options.shouldReplaceId ? getEdgeId(newConnection) : oldEdgeId,
      source: newConnection.source,
      target: newConnection.target,
   } as EdgeType;

   return edges.filter((e) => e.id !== oldEdgeId).concat(edge);
};
