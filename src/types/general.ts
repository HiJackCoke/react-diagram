import { ComponentType, MemoExoticComponent } from 'react';
import { D3DragEvent, SubjectPosition, ZoomBehavior } from 'd3';

import {
   Transform,
   Node,
   NodeProps,
   NodeInternals,
   NodeOrigin,
   NodeDimensionUpdate,
   WrapNodeProps,
   NodeChange,
   NodeDragHandler,
   NodeDragItem,
   CoordinateExtent,
} from '.';

export type OnNodesChange = (changes: NodeChange[]) => void;

export type UnselectNodesParams = {
   nodes?: Node[];
};

export type OnError = (id: string, message: string) => void;

export type GridStep = [number, number];

export type ReactDiagramStore = {
   rfId: string;
   width: number;
   height: number;
   transform: Transform;
   nodeInternals: NodeInternals;

   hasDefaultNodes: boolean;
   domNode: HTMLDivElement | null;
   nodeOrigin: NodeOrigin;
   gridStep?: GridStep;
   nodesSelectionActive: boolean;
   elevateNodesOnSelect: boolean;
   nodesDraggable: boolean;
   nodeExtent: CoordinateExtent;

   d3Zoom: ZoomBehavior<Element, unknown> | null;

   onError?: OnError;

   onNodesChange: OnNodesChange | null;
   onNodeDragStart?: NodeDragHandler;
   onNodeDrag?: NodeDragHandler;
};

export type ReactDiagramActions = {
   setNodes: (nodes: Node[]) => void;
   getNodes: () => Node[];
   addSelectedNodes: (nodeIds: string[]) => void;
   unselectNodes: (params?: UnselectNodesParams) => void;

   updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
   updateNodePositions: (
      nodeDragItems: NodeDragItem[] | Node[],
      positionChanged: boolean,
      dragging: boolean,
   ) => void;
   triggerNodeChanges: (changes: NodeChange[]) => void;
};

export type ReactDiagramState = ReactDiagramStore & ReactDiagramActions;

export type NodeTypes = { [key: string]: ComponentType<NodeProps> };
export type NodeTypesWrapped = {
   [key: string]: MemoExoticComponent<ComponentType<WrapNodeProps>>;
};

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
