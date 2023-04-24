import type { ReactDiagramStore } from '../types';

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
};

export default initialState;
