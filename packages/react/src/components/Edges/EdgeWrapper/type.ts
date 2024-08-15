import {
   ComponentType,
   MemoExoticComponent,
   MouseEvent as ReactMouseEvent,
} from 'react';

import { PortType, Connection, EdgePosition } from '@diagram/core';

import { Edge } from '../type';

export type EdgeMouseHandler = (event: ReactMouseEvent, edge: Edge) => void;

export type OnEdgeUpdateFunc<EdgeType extends Edge = Edge> = (
   originEdge: EdgeType,
   newConnection: Connection,
) => void;

export type WrapEdgeProps<
   EdgeData extends Record<string, unknown> = Record<string, unknown>,
> = Edge<EdgeData> &
   EdgePosition & {
      elementsSelectable?: boolean;

      rfId?: string;
      isFocusable: boolean;

      edgeUpdaterRadius?: number;

      onClick?: EdgeMouseHandler;
      onDoubleClick?: EdgeMouseHandler;
      onContextMenu?: EdgeMouseHandler;
      onMouseEnter?: EdgeMouseHandler;
      onMouseMove?: EdgeMouseHandler;
      onMouseLeave?: EdgeMouseHandler;

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

export type EdgeWrapperComponent = MemoExoticComponent<
   ComponentType<WrapEdgeProps>
>;
