import type { HTMLAttributes, MouseEvent as ReactMouseEvent } from 'react';

import {
   CoordinateExtent,
   EdgeTypes,
   GridStep,
   Viewport,
   Node,
   NodeTypes,
   Edge,
   OnNodesChange,
   OnEdgesChange,
   OnConnect,
   OnConnectStart,
   OnConnectEnd,
   PortType,
   OnMove,
   OnError,
} from '.';

import { NodeDragHandler } from '../hooks/useDrag/type';
import { KeyCode } from '../hooks/useGlobalKeyHandler';
import { NodeOrigin } from '../components/Node/utils';
import { NodeMouseHandler } from '../components/Node/wrapNode';
import {
   EdgeMouseHandler,
   OnEdgeUpdateFunc,
} from '../components/Edges/wrapEdge';

export type ReactDiagramProps = HTMLAttributes<HTMLDivElement> & {
   onlyRenderVisibleElements?: boolean;
   disableKeyboardA11y?: boolean;

   nodeExtent?: CoordinateExtent;
   nodeOrigin?: NodeOrigin;
   gridStep?: GridStep;

   elevateNodesOnSelect?: boolean;

   nodes?: Node[];
   nodeTypes?: NodeTypes;

   edges?: Edge[];
   edgeTypes?: EdgeTypes;

   onNodesChange?: OnNodesChange;
   onNodeClick?: NodeMouseHandler;
   onNodeDoubleClick?: NodeMouseHandler;
   onNodeContextMenu?: NodeMouseHandler;
   onNodeMouseEnter?: NodeMouseHandler;
   onNodeMouseMove?: NodeMouseHandler;
   onNodeMouseLeave?: NodeMouseHandler;
   onNodeDragStart?: NodeDragHandler;
   onNodeDrag?: NodeDragHandler;
   onNodeDragEnd?: NodeDragHandler;

   onEdgesChange?: OnEdgesChange;
   onEdgeClick?: (event: ReactMouseEvent, node: Edge) => void;
   onEdgeDoubleClick?: EdgeMouseHandler;
   onEdgeContextMenu?: EdgeMouseHandler;
   onEdgeMouseEnter?: EdgeMouseHandler;
   onEdgeMouseMove?: EdgeMouseHandler;
   onEdgeMouseLeave?: EdgeMouseHandler;

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

   onConnect?: OnConnect;
   onConnectStart?: OnConnectStart;
   onConnectEnd?: OnConnectEnd;

   onMove?: OnMove;
   onMoveStart?: OnMove;
   onMoveEnd?: OnMove;

   onError?: OnError;

   minZoom?: number;
   maxZoom?: number;
   defaultViewport?: Viewport;
   translateExtent?: CoordinateExtent;

   multiSelectionKeyCode?: KeyCode;

   nodesDraggable?: boolean;
   noDragClassName?: string;
   noPanClassName?: string;
   panning?: boolean;
   autoPanOnNodeDrag?: boolean;
   autoPanOnConnect?: boolean;
};

export type ReactDiagramRefType = HTMLDivElement;
