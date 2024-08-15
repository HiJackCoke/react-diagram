import { CSSProperties } from 'react';

import { EdgeLabelOptions } from './EdgeLabel';

import { CoreEdge, DefaultCoreEdgeOptions, EdgePosition } from '@diagram/core';

export type DefaultEdgeOptions = DefaultCoreEdgeOptions<Edge>;

export type Edge<
   EdgeData extends Record<string, unknown> = Record<string, unknown>,
   EdgeType extends string | undefined = string | undefined,
> = CoreEdge<EdgeData, EdgeType> &
   EdgeLabelOptions & {
      style?: CSSProperties;
      className?: string;
      focusable?: boolean;
   };

export type EdgeProps<EdgeType extends Edge = Edge> = Pick<
   EdgeType,
   'id' | 'data' | 'style' | 'selected' | 'source' | 'target'
> &
   EdgePosition &
   EdgeLabelOptions & {
      markerStart?: string;
      markerEnd?: string;
      pathOptions?: any;
   };

export type EdgeComponentProps<PathOptions> = Pick<
   Edge,
   'id' | 'markerStart' | 'markerEnd' | 'style' | 'sourcePort' | 'targetPort'
> &
   EdgePosition &
   EdgeLabelOptions & {
      pathOptions?: PathOptions;
   };
