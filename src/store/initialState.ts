import { CoordinateExtent } from '../types';
import { ReactDiagramStore } from 'components/ReactDiagramProvider/type';

export const infiniteExtent: CoordinateExtent = [
   [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
   [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
];

const initialState: ReactDiagramStore = {
   rfId: '1',
   width: 0,
   height: 0,
   transform: [0, 0, 1],
   nodeInternals: new Map(),
   edges: [],
   elementsSelectable: true,
   onNodesChange: null,

   domNode: null,
   nodeOrigin: [0, 0],
   gridStep: undefined,
   nodesSelectionActive: false,
   elevateNodesOnSelect: true,

   nodesDraggable: true,
   nodeExtent: infiniteExtent,
   multiSelectionActive: false,

   d3Zoom: null,
   d3Selection: null,

   connectionPosition: { x: 0, y: 0 },
   connectionNodeId: null,
   connectionPortType: 'source',
   autoPanOnNodeDrag: true,
   autoPanOnConnect: true,
};

export default initialState;
