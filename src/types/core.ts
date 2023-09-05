import type { HTMLAttributes } from 'react';

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

   minZoom?: number;
   maxZoom?: number;
   defaultViewport?: Viewport;
   translateExtent?: CoordinateExtent;

   nodesDraggable?: boolean;
   noDragClassName?: string;
   noPanClassName?: string;
};

export type ReactDiagramRefType = HTMLDivElement;
