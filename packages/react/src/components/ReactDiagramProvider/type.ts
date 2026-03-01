import { ZoomBehavior, Selection as D3Selection } from 'd3';

import type {
   Transform,
   CoordinateExtent,
   XYPosition,
   GridStep,
   OnConnectStart,
   OnConnect,
   OnConnectEnd,
   PanBy,
   NodeInternals,
   UpdateConnection,
   NodeDragItem,
   NodeOrigin,
   ConnectingPort,
} from 'cosmos-diagram';
import { Node, Edge, DefaultEdgeOptions, OnError } from '../../types';

import {
   NodeChange,
   OnNodesChange,
   OnEdgesChange,
   NodeDimensionUpdate,
} from '../../types/general';

export type NodeDragHandler<NodeType extends Node = Node> = (
   event: MouseEvent | TouchEvent,
   node: NodeType,
   nodes: NodeType[],
) => void;

export type UnSelectNodesParams<NodeType extends Node = Node> = {
   nodes?: NodeType[];
};

export type ReactDiagramStore<
   NodeType extends Node = Node,
   EdgeType extends Edge = Edge,
> = {
   rfId: string;
   width: number;
   height: number;
   transform: Transform; //
   nodeInternals: NodeInternals<NodeType>; //
   edges: EdgeType[];
   defaultEdgeOptions?: DefaultEdgeOptions;

   domNode: HTMLDivElement | null; //
   nodeOrigin: NodeOrigin; //
   smoothStep: boolean; //
   centerStep: boolean; //
   gridStep?: GridStep; //
   elevateNodesOnSelect: boolean;
   nodesDraggable: boolean; //

   multiSelectionActive: boolean;
   elementsSelectable: boolean;
   selectionBoxActive: boolean;

   d3Zoom: ZoomBehavior<Element, unknown> | null;
   d3Selection: D3Selection<Element, unknown, null, undefined> | null;
   minZoom: number;
   maxZoom: number;

   onError?: OnError;

   onNodesChange: OnNodesChange<NodeType> | null;
   onNodeDragStart?: NodeDragHandler<NodeType>;
   onNodeDrag?: NodeDragHandler<NodeType>;
   onNodeDragEnd?: NodeDragHandler<NodeType>;

   onEdgesChange?: OnEdgesChange<EdgeType>;

   connectionPosition: XYPosition;

   connectionStartPort: ConnectingPort | null;
   connectionEndPort: ConnectingPort | null;

   onConnect?: OnConnect;
   onConnectStart?: OnConnectStart;
   onConnectEnd?: OnConnectEnd;

   autoPanOnNodeDrag: boolean; //
   autoPanOnConnect: boolean;

   nodeExtent: CoordinateExtent; //
   translateExtent: CoordinateExtent;

   connectionRadius: number;
};

export type ReactDiagramActions<
   NodeType extends Node = Node,
   EdgeType extends Edge = Edge,
> = {
   setNodes: (nodes: NodeType[]) => void;
   getNodes: () => NodeType[];
   addSelectedNodes: (nodeIds: string[]) => void;
   unselectNodes: (params?: UnSelectNodesParams<NodeType>) => void;
   resetSelectedElements: () => void;

   setEdges: (edges: EdgeType[]) => void;

   updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
   updateNodesPosition: (
      nodeDragItems: NodeDragItem[] | NodeType[],
      dragging: boolean,
      updateFunc?: (node: NodeDragItem | NodeType) => void,
   ) => void; //
   updateNodesIntersection: () => void; //
   triggerNodeChanges: (changes: NodeChange<NodeType>[]) => void;

   cancelConnection: () => void;
   updateConnection: UpdateConnection;

   panBy: PanBy; //

   setNodeExtent: (nodeExtent: CoordinateExtent) => void;
   setTranslateExtent: (translateExtent: CoordinateExtent) => void;
   setMinZoom: (minZoom: number) => void;
   setMaxZoom: (minZoom: number) => void;
};

export type ReactDiagramState<
   NodeType extends Node = Node,
   EdgeType extends Edge = Edge,
> = ReactDiagramStore<NodeType, EdgeType> &
   ReactDiagramActions<NodeType, EdgeType>;
