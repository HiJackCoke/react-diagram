import { ZoomBehavior, Selection as D3Selection } from 'd3';

import {
   Node,
   Edge,
   DefaultEdgeOptions,
   Transform,
   GridStep,
   CoordinateExtent,
   OnError,
   XYPosition,
   OnConnect,
   OnConnectStart,
   OnConnectEnd,
} from '../../types';

import { NodeInternals, NodeDimensionUpdate } from '../../store/type';

import {
   NodeChange,
   OnNodesChange,
   OnEdgesChange,
} from '../../hooks/useNodesEdgesState/type';

import { NodeDragItem, NodeDragHandler } from '../../hooks/useDrag/type';
import { NodeOrigin } from '../Node/utils';
import { PortType } from '../Port/type';

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
   smoothStep: boolean;
   centerStep: boolean;
   gridStep?: GridStep;
   elevateNodesOnSelect: boolean;
   nodesDraggable: boolean;

   multiSelectionActive: boolean;
   elementsSelectable: boolean;
   selectionBoxActive: boolean;

   d3Zoom: ZoomBehavior<Element, unknown> | null;
   d3Selection: D3Selection<Element, unknown, null, undefined> | null;
   minZoom: number;
   maxZoom: number;

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

   connectionRadius: number;
};

export type ReactDiagramActions = {
   setNodes: (nodes: Node[]) => void;
   getNodes: () => Node[];
   addSelectedNodes: (nodeIds: string[]) => void;
   unselectNodes: (params?: UnSelectNodesParams) => void;
   resetSelectedElements: () => void;

   setEdges: (edges: Edge[]) => void;

   updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
   updateNodesPosition: (
      nodeDragItems: NodeDragItem[] | Node[],
      dragging: boolean,
      updateFunc?: (node: NodeDragItem | Node) => void,
   ) => void;
   updateNodesIntersection: () => void;
   triggerNodeChanges: (changes: NodeChange[]) => void;

   cancelConnection: () => void;
   panBy: (delta: XYPosition) => void;

   setNodeExtent: (nodeExtent: CoordinateExtent) => void;
   setTranslateExtent: (translateExtent: CoordinateExtent) => void;
   setMinZoom: (minZoom: number) => void;
   setMaxZoom: (minZoom: number) => void;
};

export type ReactDiagramState = ReactDiagramStore & ReactDiagramActions;
