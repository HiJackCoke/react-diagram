import {
   ComponentType,
   MemoExoticComponent,
   MouseEvent as ReactMouseEvent,
} from 'react';

import {  Connection, EdgePosition } from 'cosmos-diagram';

import { Edge } from '../type';
import { Node, ReactDiagramProps } from '../../../types';
import { ReactDiagramStore } from '../../ReactDiagramProvider/type';

export type EdgeMouseHandler<EdgeType extends Edge = Edge> = (
   event: ReactMouseEvent,
   edge: EdgeType,
) => void;

export type OnEdgeUpdateFunc<EdgeType extends Edge = Edge> = (
   originEdge: EdgeType,
   newConnection: Connection,
) => void;

// export type WrapEdgeProps<EdgeType extends Edge = Edge> = Edge &
//    EdgePosition & {
//       elementsSelectable?: boolean;

//       rfId?: string;
//       isFocusable: boolean;

//       edgeUpdaterRadius?: number;

//       onClick?: EdgeMouseHandler<EdgeType>;
//       onDoubleClick?: EdgeMouseHandler<EdgeType>;
//       onContextMenu?: EdgeMouseHandler<EdgeType>;
//       onMouseEnter?: EdgeMouseHandler<EdgeType>;
//       onMouseMove?: EdgeMouseHandler<EdgeType>;
//       onMouseLeave?: EdgeMouseHandler<EdgeType>;

//       onEdgeUpdate?: OnEdgeUpdateFunc<EdgeType>;
//       onEdgeUpdateStart?: (
//          event: ReactMouseEvent,
//          edge: EdgeType,
//          portType: PortType,
//       ) => void;
//       onEdgeUpdateEnd?: (
//          event: ReactMouseEvent,
//          edge: EdgeType,
//          portType: PortType,
//       ) => void;
//    };

export type WrapEdgeProps<EdgeType extends Edge = Edge> = Edge &
   EdgePosition &
   Partial<
      Pick<ReactDiagramStore<Node, EdgeType>, 'rfId' | 'elementsSelectable'>
   > &
   Pick<
      ReactDiagramProps<Node, EdgeType>,
      | 'edgeUpdaterRadius'
      | 'onEdgeUpdate'
      | 'onEdgeUpdateStart'
      | 'onEdgeUpdateEnd'
   > & {
      isFocusable: boolean;

      onClick?: EdgeMouseHandler<EdgeType>;
      onDoubleClick?: EdgeMouseHandler<EdgeType>;
      onContextMenu?: EdgeMouseHandler<EdgeType>;
      onMouseEnter?: EdgeMouseHandler<EdgeType>;
      onMouseMove?: EdgeMouseHandler<EdgeType>;
      onMouseLeave?: EdgeMouseHandler<EdgeType>;
   };

export type EdgeWrapperProps<EdgeType extends Edge = Edge> =
   MemoExoticComponent<ComponentType<WrapEdgeProps<EdgeType>>>;
