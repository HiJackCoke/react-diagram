import type { HTMLAttributes } from 'react';

import { CoordinateExtent, EdgeTypes, GridStep, Viewport } from '.';

import { OnNodesChange, OnEdgesChange } from 'hooks/useNodesEdgesState/type';
import {
   Node,
   NodeOrigin,
   NodeMouseHandler,
   NodeDragHandler,
} from 'components/Node/type';
import { Edge } from 'components/Edges/type';
import { NodeTypes } from 'container/NodeRenderer/type';

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
   edgeType?: EdgeTypes;

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

   minZoom?: number;
   maxZoom?: number;
   defaultViewport?: Viewport;
   translateExtent?: CoordinateExtent;

   nodesDraggable?: boolean;
};

export type ReactDiagramRefType = HTMLDivElement;
