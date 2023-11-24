import type {
   CSSProperties,
   HTMLAttributes,
   MouseEvent as ReactMouseEvent,
} from 'react';

import {
   CoordinateExtent,
   GridStep,
   Viewport,
   Node,
   Edge,
   OnNodesChange,
   OnEdgesChange,
   OnConnect,
   OnConnectStart,
   OnConnectEnd,
   OnMove,
   OnError,
   ConnectionLineComponent,
} from '.';

import { NodeDragHandler } from '../hooks/useDrag/type';
import { KeyCode } from '../hooks/useGlobalKeyHandler';
import { NodeOrigin } from '../components/Node/utils';
import { NodeMouseHandler } from '../components/Node/NodeWrapper/type';
import { NodeTypes } from '../container/NodeRenderer/type';
import {
   EdgeMouseHandler,
   OnEdgeUpdateFunc,
} from '../components/Edges/EdgeWrapper/type';
import { EdgeTypes } from '../container/EdgeRenderer/type';
import { PortType } from '../components/Port/type';

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
   edgeUpdaterRadius?: number;
   ConnectionLineContainerStyle?: CSSProperties;
   ConnectionLineComponent?: ConnectionLineComponent;
   connectionRadius?: number;

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
