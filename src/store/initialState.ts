import type { ReactDiagramStore, CoordinateExtent } from '../types';

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
   onNodesChange: null,
   hasDefaultNodes: false,
   domNode: null,
   nodeOrigin: [0, 0],
   nodesSelectionActive: false,
   elevateNodesOnSelect: true,

   nodesDraggable: true,
   nodeExtent: infiniteExtent,
};

export default initialState;
