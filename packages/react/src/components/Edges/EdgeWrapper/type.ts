import {
   ComponentType,
   MemoExoticComponent,
   MouseEvent as ReactMouseEvent,
} from 'react';

import { Connection, EdgePosition } from 'cosmos-diagram';

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

export type WrapEdgeProps<EdgeType extends Edge = Edge> = Edge &
   EdgePosition &
   Pick<ReactDiagramStore<Node, EdgeType>, 'elementsSelectable'> &
   Pick<
      ReactDiagramProps<Node, EdgeType>,
      | 'edgeUpdaterRadius'
      | 'onEdgeUpdate'
      | 'onEdgeUpdateStart'
      | 'onEdgeUpdateEnd'
   > & {
      rfId?: string;
      onClick?: EdgeMouseHandler<EdgeType>;
      onDoubleClick?: EdgeMouseHandler<EdgeType>;
      onContextMenu?: EdgeMouseHandler<EdgeType>;
      onMouseEnter?: EdgeMouseHandler<EdgeType>;
      onMouseMove?: EdgeMouseHandler<EdgeType>;
      onMouseLeave?: EdgeMouseHandler<EdgeType>;
   };

export type EdgeWrapperProps<EdgeType extends Edge = Edge> =
   MemoExoticComponent<ComponentType<WrapEdgeProps<EdgeType>>>;
