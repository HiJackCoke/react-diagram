import type { HTMLAttributes } from 'react';

import type {
   NodeTypes,
   Node,
   CoordinateExtent,
   NodeMouseHandler,
   NodeOrigin,
} from '.';

export type ReactDiagramProps = HTMLAttributes<HTMLDivElement> & {
   onlyRenderVisibleElements?: boolean;
   disableKeyboardA11y?: boolean;

   nodeExtent?: CoordinateExtent;
   nodeOrigin?: NodeOrigin;
   nodes?: Node[];
   defaultNodes?: Node[];
   nodeTypes?: NodeTypes;

   onNodeClick?: NodeMouseHandler;
   onNodeDoubleClick?: NodeMouseHandler;
   onNodeMouseEnter?: NodeMouseHandler;
   onNodeMouseMove?: NodeMouseHandler;
   onNodeMouseLeave?: NodeMouseHandler;
   onNodeContextMenu?: NodeMouseHandler;
   selectNodesOnDrag?: boolean;
};

export type ReactDiagramRefType = HTMLDivElement;
