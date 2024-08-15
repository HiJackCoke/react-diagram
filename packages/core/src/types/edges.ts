import { Position } from './utils';

export enum MarkerType {
   Arrow = 'arrow',
}

export type EdgeMarker = {
   type: MarkerType;
   color?: string;
   width?: number;
   height?: number;
   markerUnits?: string;
   orient?: string;
   strokeWidth?: number;
};

export type CoreEdge<
   EdgeData extends Record<string, unknown> = Record<string, unknown>,
   EdgeType extends string | undefined = string | undefined,
> = {
   id: string;
   type?: EdgeType;
   source: string;
   target: string;
   sourcePort?: string | null;
   targetPort?: string | null;
   // style?: CSSProperties;

   data?: EdgeData;
   // className?: string;
   //    sourceNode?: Node;
   //    targetNode?: Node;
   selected?: boolean;
   markerStart?: EdgeMarker;
   markerEnd?: EdgeMarker;
   zIndex?: number;
   ariaLabel?: string;

   //    focusable?: boolean;
   hidden?: boolean;
   deletable?: boolean;
};

export type DefaultCoreEdgeOptions<EdgeType extends CoreEdge> = Omit<
   EdgeType,
   'id' | 'source' | 'target' | 'sourcePort' | 'targetPort'
>;

export type EdgePosition = {
   sourceX: number;
   sourceY: number;
   targetX: number;
   targetY: number;
   sourcePosition: Position;
   targetPosition: Position;
};
