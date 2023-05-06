import type { HTMLAttributes } from 'react';

import type {
   NodeTypes,
   Node,
   CoordinateExtent,
   NodeMouseHandler,
   NodeOrigin,
   NodeDragHandler,
   OnNodesChange,
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

   onNodeClick?: NodeMouseHandler;
   onNodeDoubleClick?: NodeMouseHandler;
   onNodeMouseEnter?: NodeMouseHandler;
   onNodeMouseMove?: NodeMouseHandler;
   onNodeMouseLeave?: NodeMouseHandler;
   onNodeContextMenu?: NodeMouseHandler;
   onNodesChange?: OnNodesChange;
   onNodeDragStart?: NodeDragHandler;
   onNodeDrag?: NodeDragHandler;
   selectNodesOnDrag?: boolean;
};

export type ReactDiagramRefType = HTMLDivElement;
