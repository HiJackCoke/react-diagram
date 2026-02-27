import type {
   CSSProperties,
   HTMLAttributes,
   MouseEvent as ReactMouseEvent,
} from 'react';

import {
   CoordinateExtent,
   PortType,
   GridStep,
   OnConnectStart,
   OnConnect,
   OnConnectEnd,
   NodeOrigin,
   Viewport,
   OnMove,
} from 'cosmos-diagram';
import {
   Node,
   Edge,
   OnNodesChange,
   OnEdgesChange,
   OnError,
   ConnectionLineComponent,
} from '.';

import { KeyCode } from '../hooks/useGlobalKeyHandler';

import { NodeMouseHandler } from '../components/Node/NodeWrapper/type';
import { NodeTypes } from '../container/NodeRenderer/type';
import {
   EdgeMouseHandler,
   OnEdgeUpdateFunc,
} from '../components/Edges/EdgeWrapper/type';
import { EdgeTypes } from '../container/EdgeRenderer/type';
import { NodeDragHandler } from '../components/ReactDiagramProvider/type';

type NoInfer<T> = [T][T extends any ? 0 : never];

export type ReactDiagramProps<
   NodeType extends Node = Node,
   EdgeType extends Edge = Edge,
> = HTMLAttributes<HTMLDivElement> & {
   onlyRenderVisibleElements?: boolean;
   disableKeyboardA11y?: boolean;

   nodeExtent?: CoordinateExtent;
   nodeOrigin?: NodeOrigin;
   smoothStep?: boolean;
   centerStep?: boolean;
   gridStep?: GridStep;

   elevateNodesOnSelect?: boolean;

   nodes?: NodeType[];
   nodeTypes?: NodeTypes<NodeType>;
   edges?: EdgeType[];
   edgeTypes?: EdgeTypes<EdgeType>;
   edgeUpdaterRadius?: number;
   ConnectionLineContainerStyle?: CSSProperties;
   ConnectionLineComponent?: ConnectionLineComponent;
   connectionRadius?: number;

   onNodesChange?: OnNodesChange;
   onNodeClick?: NodeMouseHandler<NodeType>;
   onNodeDoubleClick?: NodeMouseHandler<NodeType>;
   onNodeContextMenu?: NodeMouseHandler<NodeType>;
   onNodeMouseEnter?: NodeMouseHandler<NodeType>;
   onNodeMouseMove?: NodeMouseHandler<NodeType>;
   onNodeMouseLeave?: NodeMouseHandler<NodeType>;
   onNodeDragStart?: NodeDragHandler<NodeType>;
   onNodeDrag?: NodeDragHandler<NodeType>;
   onNodeDragEnd?: NodeDragHandler<NodeType>;

   onEdgesChange?: OnEdgesChange;
   onEdgeClick?: (event: ReactMouseEvent, edge: EdgeType) => void;
   onEdgeDoubleClick?: EdgeMouseHandler<EdgeType>;
   onEdgeContextMenu?: EdgeMouseHandler<EdgeType>;
   onEdgeMouseEnter?: EdgeMouseHandler<EdgeType>;
   onEdgeMouseMove?: EdgeMouseHandler<EdgeType>;
   onEdgeMouseLeave?: EdgeMouseHandler<EdgeType>;

   onEdgeUpdate?: OnEdgeUpdateFunc<EdgeType>;
   onEdgeUpdateStart?: (
      event: ReactMouseEvent,
      edge: EdgeType,
      portType: PortType,
   ) => void;
   onEdgeUpdateEnd?: (
      event: ReactMouseEvent,
      edge: NoInfer<EdgeType>,
      portType: PortType,
   ) => void;

   onConnect?: OnConnect;
   onConnectStart?: OnConnectStart;
   onConnectEnd?: OnConnectEnd;

   onMove?: OnMove;
   onMoveStart?: OnMove;
   onMoveEnd?: OnMove;
   onPaneClick?: OnMove;

   onPaneMouseEnter?: (event: ReactMouseEvent) => void;
   onPaneMouseMove?: (event: ReactMouseEvent) => void;
   onPaneMouseLeave?: (event: ReactMouseEvent) => void;

   onError?: OnError;

   minZoom?: number;
   maxZoom?: number;
   defaultViewport?: Viewport;
   translateExtent?: CoordinateExtent;

   multiSelectionKeyCode?: KeyCode;
   dragSelectionKeyCode?: KeyCode;

   nodesDraggable?: boolean;
   noDragClassName?: string;
   noPanClassName?: string;
   panning?: boolean;
   autoPanOnNodeDrag?: boolean;
   autoPanOnConnect?: boolean;
};

export type ReactDiagramRefType = HTMLDivElement;
