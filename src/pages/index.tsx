import { useCallback } from 'react';

import { useNodesState, useEdgesState } from 'hooks/useNodesEdgesState';

import ReactDiagramProvider from 'components/ReactDiagramProvider';

import ReactDiagram from 'container/ReactDiagram';

import { addEdge } from 'utils/graph';

import { MarkerType } from 'components/Edges/type';

import { Connection } from 'types';

import './style.css';

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

   return (
      <>
         <button
            style={{ position: 'fixed', zIndex: '9999' }}
            onClick={addNode}
         >
            Add Node
         </button>
         <ReactDiagramProvider>
            <ReactDiagram
               nodes={nodes}
               edges={edges}
               // minZoom={minZoom}
               // maxZoom={maxZoom}
               onNodesChange={onNodesChange}
               onEdgesChange={onEdgesChange}
               onConnect={onConnect}
               onConnectEnd={console.log}
            />
         </ReactDiagramProvider>
      </>
   );
}

export default Index;
