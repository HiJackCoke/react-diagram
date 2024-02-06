import ReactDiagram, {
   useNodesState,
   useEdgesState,
   MarkerType,
} from 'react-cosmos-diagram';

import Edge from 'components/Edge';

import 'react-cosmos-diagram/dist/style.css';

const edgeTypes = {
   c: Edge,
};

const initialNodes = [
   {
      id: '1',
      data: { label: 'Node1' },
      position: { x: 100, y: 100 },
   },
   {
      id: '2',

      data: { label: 'Node2' },
      position: { x: 300, y: 50 },
   },
   {
      id: '3',
      width: 100,
      height: 100,
      data: { label: 'Node3' },
      position: { x: 110, y: 210 },
   },
   {
      id: '4',
      width: 100,
      height: 100,
      data: { label: 'Node4' },
      position: { x: 650, y: 100 },
   },
   {
      id: '5',
      width: 100,
      height: 100,
      data: { label: 'Node5' },
      position: { x: 550, y: 400 },
   },
];

const initialEdges = [
   {
      id: 'e-1-2',
      type: 'bezier',
      source: '1',
      target: '2',
      markerStart: {
         type: MarkerType.Arrow,
      },
   },
   {
      id: 'e-2-3',
      source: '2',
      target: '3',
      markerEnd: {
         type: MarkerType.Arrow,
      },
      type: 'step',
      label: 'label',
   },
   {
      id: 'e-3-4',
      type: 'c',
      source: '3',
      target: '4',
      markerEnd: {
         type: MarkerType.Arrow,
      },
      data: {
         label: 'label',
      },
   },
];

function CustomEdgeP() {
   const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
   const [edges, _setEdges, onEdgesChange] = useEdgesState(initialEdges);

   return (
      <ReactDiagram
         nodes={nodes}
         edges={edges}
         edgeTypes={edgeTypes}
         connectionRadius={30}
         onNodesChange={onNodesChange}
         onEdgesChange={onEdgesChange}
      />
   );
}

export default CustomEdgeP;
