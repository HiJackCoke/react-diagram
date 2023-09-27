import { useCallback, useRef } from 'react';

import { useNodesState, useEdgesState } from 'hooks/useNodesEdgesState';

import ReactDiagram from 'container/ReactDiagram';

import { addEdge, updateEdge } from 'utils/graph';

import { MarkerType } from 'components/Edges/type';

import { Connection, Edge } from 'types';

import './style.css';

const initialNodes = [
   {
      id: '1',
      width: 50,
      height: 100,
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
      data: { label: 'Node3' },
      position: { x: 10, y: 10 },
      parentNode: '1',
   },
   {
      id: '4',
      data: { label: 'Node4' },
      position: { x: 650, y: 100 },
   },
];

const initialEdges = [
   {
      id: 'e-1-2',
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

function Index() {
   const edgeUpdateSuccessful = useRef(true);

   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      (oldEdge: Edge, newConnection: Connection) => {
         edgeUpdateSuccessful.current = true;
         setEdges((els) => updateEdge(oldEdge, newConnection, els));
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
            // panning={false}
            // minZoom={minZoom}
            // maxZoom={maxZoom}
            onNodesChange={onNodesChange}
            onNodeDrag={console.log}
            onNodeDragStart={console.log}
            onNodeDragEnd={console.log}
            onNodeClick={console.log}
            onNodeDoubleClick={console.log}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            // autoPanOnNodeDrag={false}
            // autoPanOnConnect={false}
            onMove={console.log}
            onMoveStart={console.log}
            onMoveEnd={console.log}
         />
      </>
   );
}

export default Index;
