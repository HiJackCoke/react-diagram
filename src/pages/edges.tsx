import { useCallback, useRef } from 'react';

import ReactDiagram, {
   useNodesState,
   useEdgesState,
   addEdge,
   updateEdge,
   Connection,
   Edge,
   MarkerType,
} from 'react-cosmos-diagram';

import 'react-cosmos-diagram/dist/style.css';

const initialNodes = [
   {
      id: '1',

      // width: 100,
      // height: 100,
      data: { label: 'Node1' },
      position: { x: 100, y: 100 },
   },
   {
      id: '2',
      // width: 100,
      // height: 100,
      data: { label: 'Node2' },
      position: { x: 300, y: 50 },
   },
   {
      id: '3',
      width: 100,
      height: 100,
      data: { label: 'Node3' },
      position: { x: 10, y: 10 },
   },
   {
      id: '4',
      width: 100,
      height: 100,
      data: { label: 'Node4' },
      position: { x: 650, y: 100 },
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

let idIndex = 5;

function Edges() {
   const edgeUpdateSuccessful = useRef(true);

   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

   const addNode = () => {
      const newNode = {
         id: `${idIndex}`,
         data: { label: `node${idIndex}` },
         position: { x: Math.random() * 1000, y: Math.random() * 1000 },
      };

      setNodes((nodes) => [...nodes, newNode]);

      idIndex++;
   };

   const onConnect = useCallback(
      (params: Connection) => setEdges((eds) => addEdge({ ...params }, eds)),
      [],
   );

   const onEdgeUpdateStart = useCallback(() => {
      edgeUpdateSuccessful.current = false;
   }, []);

   const onEdgeUpdate = useCallback(
      (originEdge: Edge, newConnection: Connection) => {
         edgeUpdateSuccessful.current = true;
         setEdges((els) => updateEdge(originEdge, newConnection, els));
      },
      [],
   );

   const onEdgeUpdateEnd = useCallback((_c: any, edge: Edge) => {
      if (!edgeUpdateSuccessful.current) {
         setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeUpdateSuccessful.current = true;
   }, []);

   return (
      <>
         <button
            style={{ position: 'fixed', zIndex: '9999' }}
            onClick={addNode}
         >
            Add Node
         </button>

         <ReactDiagram
            nodes={nodes}
            edges={edges}
            edgeUpdaterRadius={30}
            connectionRadius={30}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
         ></ReactDiagram>
      </>
   );
}

export default Edges;
