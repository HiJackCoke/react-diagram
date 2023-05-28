import { CSSProperties } from 'react';

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

export type EdgeMarkerType = string | EdgeMarker;

export type DefaultEdge<T = any> = {
   id: string;
   type?: string;
   source: string;
   target: string;
   sourceHandle?: string | null;
   targetHandle?: string | null;
   style?: CSSProperties;

   data?: T;
   className?: string;
   sourceNode?: Node;
   targetNode?: Node;
   selected?: boolean;
   markerStart?: EdgeMarkerType;
   markerEnd?: EdgeMarkerType;
   zIndex?: number;
   ariaLabel?: string;

   focusable?: boolean;
   hidden?: boolean;
   deletable?: boolean;
};

export type Edge<T = any> = DefaultEdge<T>;

export type WrapEdgeProps<T = any> = Omit<
   Edge<T>,
   'sourceHandle' | 'targetHandle'
> & {
   sourceHandleId?: string | null;
   targetHandleId?: string | null;
   sourceX: number;
   sourceY: number;
   targetX: number;
   targetY: number;
   sourcePosition: Position;
   targetPosition: Position;
   elementsSelectable?: boolean;

   rfId?: string;
   isFocusable: boolean;
};

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
      | 'sourceHandleId'
      | 'targetHandleId'
   > & {
      markerStart?: string;
      markerEnd?: string;
   };

export type BaseEdgeProps = Pick<
   EdgeProps,
   'style' | 'markerStart' | 'markerEnd'
> & {
   path: string;
};

export type StepPathOptions = {
   offset?: number;
   borderRadius?: number;
};

export type StepEdgeProps<T = any> = EdgeProps<T> & {
   pathOptions?: StepPathOptions;
};

export type DefaultEdgeOptions = Omit<
   Edge,
   | 'id'
   | 'source'
   | 'target'
   | 'sourceHandle'
   | 'targetHandle'
   | 'sourceNode'
   | 'targetNode'
>;
