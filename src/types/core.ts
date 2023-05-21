import type { HTMLAttributes } from 'react';

import type {
   NodeTypes,
   Node,
   Edge,
   CoordinateExtent,
   NodeMouseHandler,
   NodeOrigin,
   NodeDragHandler,
   OnNodesChange,
   OnEdgesChange,
   GridStep,
} from '.';

export type ReactDiagramProps = HTMLAttributes<HTMLDivElement> & {
   onlyRenderVisibleElements?: boolean;
   disableKeyboardA11y?: boolean;

   nodeExtent?: CoordinateExtent;
   nodeOrigin?: NodeOrigin;
   gridStep?: GridStep;
   nodes?: Node[];
   defaultNodes?: Node[];
   nodeTypes?: NodeTypes;

   edges?: Edge[];

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

   selectNodesOnDrag?: boolean;
};

export type ReactDiagramRefType = HTMLDivElement;
