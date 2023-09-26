import type { HTMLAttributes, MouseEvent as ReactMouseEvent } from 'react';

import {
   CoordinateExtent,
   EdgeTypes,
   GridStep,
   Viewport,
   Node,
   NodeOrigin,
   NodeMouseHandler,
   NodeDragHandler,
   NodeTypes,
   Edge,
   OnNodesChange,
   OnEdgesChange,
   OnConnect,
   OnConnectStart,
   OnConnectEnd,
   OnEdgeUpdateFunc,
   PortType,
   OnMove,
} from '.';

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

   onNodeClick?: NodeMouseHandler;
   onNodeDoubleClick?: NodeMouseHandler;
   onNodeMouseEnter?: NodeMouseHandler;
   onNodeMouseMove?: NodeMouseHandler;
   onNodeMouseLeave?: NodeMouseHandler;
   onNodeContextMenu?: NodeMouseHandler;
   onNodesChange?: OnNodesChange;
   onNodeDragStart?: NodeDragHandler;
   onNodeDrag?: NodeDragHandler;

   onEdgesChange?: OnEdgesChange;
   onConnect?: OnConnect;
   onConnectStart?: OnConnectStart;
   onConnectEnd?: OnConnectEnd;

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

   onMove?: OnMove;
   onMoveStart?: OnMove;

   minZoom?: number;
   maxZoom?: number;
   defaultViewport?: Viewport;
   translateExtent?: CoordinateExtent;

   nodesDraggable?: boolean;
   noDragClassName?: string;
   noPanClassName?: string;
   panning?: boolean;
   autoPanOnNodeDrag?: boolean;
   autoPanOnConnect?: boolean;
};

export type ReactDiagramRefType = HTMLDivElement;
