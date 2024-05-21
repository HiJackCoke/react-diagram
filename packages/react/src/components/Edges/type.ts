import { CSSProperties } from 'react';

import { EdgeLabelOptions } from './EdgeLabel';

import { WrapEdgeProps } from './EdgeWrapper/type';

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

// export type EdgeMarkerType = string | EdgeMarker; //

interface DefaultEdge<T = any> {
   id: string;
   type?: string;
   source: string;
   target: string;
   sourcePort?: string | null;
   targetPort?: string | null;
   style?: CSSProperties;

   data?: T;
   className?: string;
   sourceNode?: Node;
   targetNode?: Node;
   selected?: boolean;
   markerStart?: EdgeMarker;
   markerEnd?: EdgeMarker;
   zIndex?: number;
   ariaLabel?: string;

   focusable?: boolean;
   hidden?: boolean;
   deletable?: boolean;
}

export type Edge<T = any> = DefaultEdge<T> & EdgeLabelOptions;

export type EdgeProps<T = any> = Pick<
   Edge<T>,
   'id' | 'data' | 'style' | 'selected' | 'source' | 'target'
> &
   Pick<
      WrapEdgeProps,
      | 'sourceX'
      | 'sourceY'
      | 'targetX'
      | 'targetY'
      | 'sourcePosition'
      | 'targetPosition'
      | 'sourcePort'
      | 'targetPort'
   > &
   EdgeLabelOptions & {
      markerStart?: string;
      markerEnd?: string;
      pathOptions?: any;
   };

export type DefaultEdgeOptions = Omit<
   Edge,
   | 'id'
   | 'source'
   | 'target'
   | 'sourcePort'
   | 'targetPort'
   | 'sourceNode'
   | 'targetNode'
>;
