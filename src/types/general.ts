import { ComponentType, MemoExoticComponent } from 'react';
import { D3DragEvent, SubjectPosition } from 'd3';

import {
   Transform,
   Node,
   NodeProps,
   NodeInternals,
   NodeOrigin,
   NodeDimensionUpdate,
   WrapNodeProps,
   NodeChange,
} from '.';

export type OnNodesChange = (changes: NodeChange[]) => void;

export type UnselectNodesParams = {
   nodes?: Node[];
};

export type ReactDiagramStore = {
   rfId: string;
   width: number;
   height: number;
   transform: Transform;
   nodeInternals: NodeInternals;

   hasDefaultNodes: boolean;
   domNode: HTMLDivElement | null;
   nodeOrigin: NodeOrigin;
   nodesSelectionActive: boolean;
   elevateNodesOnSelect: boolean;
   nodesDraggable: boolean;

   onNodesChange: OnNodesChange | null;
};

export type ReactDiagramActions = {
   setNodes: (nodes: Node[]) => void;
   getNodes: () => Node[];
   addSelectedNodes: (nodeIds: string[]) => void;
   unselectNodes: (params?: UnselectNodesParams) => void;

   updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
};

export type ReactDiagramState = ReactDiagramStore & ReactDiagramActions;

export type NodeTypes = { [key: string]: ComponentType<NodeProps> };
export type NodeTypesWrapped = {
   [key: string]: MemoExoticComponent<ComponentType<WrapNodeProps>>;
};

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
