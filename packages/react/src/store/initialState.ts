import { devWarn } from 'cosmos-diagram';
import type { CoordinateExtent } from 'cosmos-diagram';
import { ReactDiagramStore } from '../components/ReactDiagramProvider/type';

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
   smoothStep: false,
   centerStep: false,
   gridStep: undefined,
   elevateNodesOnSelect: true,

   nodesDraggable: true,
   multiSelectionActive: false,
   selectionBoxActive: false,

   d3Zoom: null,
   d3Selection: null,
   minZoom: 0.5,
   maxZoom: 2,

   connectionPosition: { x: 0, y: 0 },


   connectionStartPort: null,
   connectionEndPort: null,

   autoPanOnNodeDrag: true,
   autoPanOnConnect: true,
   nodeExtent: infiniteExtent,
   translateExtent: infiniteExtent,

   connectionRadius: 20,

   onError: devWarn,
};

export default initialState;
