import {
   ReactNode,
   HTMLAttributes,
   CSSProperties,
   MouseEvent as ReactMouseEvent,
} from 'react';

import { Connection, PortType, Position } from 'types';

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

type EdgeLabelOptions = {
   label?: string | ReactNode;
   labelStyle?: CSSProperties;
   labelShowBg?: boolean;
   labelBgStyle?: CSSProperties;
   labelBgPadding?: [number, number];
   labelBgBorderRadius?: number;
};

export type EdgeLabelProps = HTMLAttributes<SVGElement> &
   EdgeLabelOptions & {
      x: number;
      y: number;
   };

export type DefaultEdge<T = any> = {
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
   markerStart?: EdgeMarkerType;
   markerEnd?: EdgeMarkerType;
   zIndex?: number;
   ariaLabel?: string;

   focusable?: boolean;
   hidden?: boolean;
   deletable?: boolean;
};

export type Edge<T = any> = DefaultEdge<T> & EdgeLabelOptions;

export type OnEdgeUpdateFunc<T = any> = (
   oldEdge: Edge<T>,
   newConnection: Connection,
) => void;

export type WrapEdgeProps<T = any> = Edge<T> & {
   sourceX: number;
   sourceY: number;
   targetX: number;
   targetY: number;
   sourcePosition: Position;
   targetPosition: Position;
   elementsSelectable?: boolean;

   rfId?: string;
   isFocusable: boolean;

   onEdgeUpdate?: OnEdgeUpdateFunc;
   onEdgeUpdateStart?: (
      event: ReactMouseEvent,
      edge: Edge,
      portType: PortType,
   ) => void;
   onEdgeUpdateEnd?: (
      event: MouseEvent | TouchEvent,
      edge: Edge,
      portType: PortType,
   ) => void;
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
      | 'sourcePort'
      | 'targetPort'
   > &
   EdgeLabelOptions & {
      markerStart?: string;
      markerEnd?: string;
      // @TODO: how can we get better types for pathOptions?
      pathOptions?: any;
   };

export type BaseEdgeProps = Pick<
   EdgeProps,
   'style' | 'markerStart' | 'markerEnd'
> &
   EdgeLabelOptions & {
      labelX?: number;
      labelY?: number;
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
   | 'sourcePort'
   | 'targetPort'
   | 'sourceNode'
   | 'targetNode'
>;
