import {
   ComponentType,
   MemoExoticComponent,
   MouseEvent as ReactMouseEvent,
} from 'react';

import { Position, Connection } from '../../../types';
import { PortType } from '../../Port/type';
import { Edge } from '../type';

export type EdgeMouseHandler = (event: ReactMouseEvent, edge: Edge) => void;

export type OnEdgeUpdateFunc<T = any> = (
   originEdge: Edge<T>,
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
