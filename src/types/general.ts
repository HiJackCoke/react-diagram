import { ComponentType, MemoExoticComponent } from 'react';
import {
   Transform,
   Node,
   NodeProps,
   NodeInternals,
   NodeOrigin,
   NodeDimensionUpdate,
   NodeChange,
   WrapNodeProps,
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
   onNodesChange: OnNodesChange | null;

   hasDefaultNodes: boolean;
   domNode: HTMLDivElement | null;
   nodeOrigin: NodeOrigin;
   nodesSelectionActive: boolean;
};

export type ReactDiagramActions = {
   //    setNodes: (nodes: Node[]) => void;
   //    getNodes: () => Node[];
   addSelectedNodes: (nodeIds: string[]) => void;
   unselectNodes: (params?: UnselectNodesParams) => void;

   updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
};

export type ReactDiagramState = ReactDiagramStore & ReactDiagramActions;

export type NodeTypes = { [key: string]: ComponentType<NodeProps> };
export type NodeTypesWrapped = {
   [key: string]: MemoExoticComponent<ComponentType<WrapNodeProps>>;
};
