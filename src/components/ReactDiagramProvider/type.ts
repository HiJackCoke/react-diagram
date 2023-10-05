import { ZoomBehavior, Selection as D3Selection } from 'd3';

import {
   Transform,
   GridStep,
   CoordinateExtent,
   OnError,
   XYPosition,
   PortType,
   OnConnect,
   OnConnectStart,
   OnConnectEnd,
} from 'types';

import {
   NodeChange,
   OnNodesChange,
   OnEdgesChange,
} from 'hooks/useNodesEdgesState/type';
import {
   Node,
   NodeInternals,
   NodeOrigin,
   NodeDragHandler,
   NodeDragItem,
   NodeDimensionUpdate,
} from 'components/Node/type';
import { DefaultEdgeOptions, Edge } from 'components/Edges/type';

export type UnSelectNodesParams = {
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

   domNode: HTMLDivElement | null;
   nodeOrigin: NodeOrigin;
   gridStep?: GridStep;
   nodesSelectionActive: boolean;
   elevateNodesOnSelect: boolean;
   nodesDraggable: boolean;

   multiSelectionActive: boolean;
   elementsSelectable: boolean;

   d3Zoom: ZoomBehavior<Element, unknown> | null;
   d3Selection: D3Selection<Element, unknown, null, undefined> | null;

   onError?: OnError;

   onNodesChange: OnNodesChange | null;
   onNodeDragStart?: NodeDragHandler;
   onNodeDrag?: NodeDragHandler;
   onNodeDragEnd?: NodeDragHandler;

   onEdgesChange?: OnEdgesChange;

   connectionPosition: XYPosition;
   connectionNodeId: string | null;
   connectionPortType: PortType | null;

   onConnect?: OnConnect;
   onConnectStart?: OnConnectStart;
   onConnectEnd?: OnConnectEnd;

   autoPanOnNodeDrag: boolean;
   autoPanOnConnect: boolean;

   nodeExtent: CoordinateExtent;
   translateExtent: CoordinateExtent;
};

export type ReactDiagramActions = {
   setNodes: (nodes: Node[]) => void;
   getNodes: () => Node[];
   addSelectedNodes: (nodeIds: string[]) => void;
   unselectNodes: (params?: UnSelectNodesParams) => void;
   resetSelectedElements: () => void;

   setEdges: (edges: Edge[]) => void;

   updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
   updateNodePositions: (
      nodeDragItems: NodeDragItem[] | Node[],
      positionChanged: boolean,
      dragging: boolean,
   ) => void;
   triggerNodeChanges: (changes: NodeChange[]) => void;

   cancelConnection: () => void;
   panBy: (delta: XYPosition) => void;

   setNodeExtent: (nodeExtent: CoordinateExtent) => void;
   setTranslateExtent: (translateExtent: CoordinateExtent) => void;
};

export type ReactDiagramState = ReactDiagramStore & ReactDiagramActions;
