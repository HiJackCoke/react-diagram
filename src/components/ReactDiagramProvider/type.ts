import { ZoomBehavior } from 'd3';

import {
   Transform,
   GridStep,
   CoordinateExtent,
   OnError,
   OnNodesChange,
   OnEdgesChange,
   NodeChange,
} from 'types';
import {
   Node,
   NodeInternals,
   NodeOrigin,
   NodeDragHandler,
   NodeDragItem,
   NodeDimensionUpdate,
} from 'components/Node/type';
import { DefaultEdgeOptions, Edge } from 'components/Edges/type';

export type UnselectNodesParams = {
   nodes?: Node[];
};

export type ReactDiagramStore = {
   rfId: string;
   width: number;
   height: number;
   transform: Transform;
   nodeInternals: NodeInternals;
   edges: Edge[];
   defaultEdgeOptions?: DefaultEdgeOptions;

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
   onEdgesChange?: OnEdgesChange;
};

export type ReactDiagramActions = {
   setNodes: (nodes: Node[]) => void;
   getNodes: () => Node[];
   addSelectedNodes: (nodeIds: string[]) => void;
   unselectNodes: (params?: UnselectNodesParams) => void;

   setEdges: (edges: Edge[]) => void;

   updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
   updateNodePositions: (
      nodeDragItems: NodeDragItem[] | Node[],
      positionChanged: boolean,
      dragging: boolean,
   ) => void;
   triggerNodeChanges: (changes: NodeChange[]) => void;
};

export type ReactDiagramState = ReactDiagramStore & ReactDiagramActions;
