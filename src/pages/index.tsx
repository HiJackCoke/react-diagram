import { useCallback, useRef } from 'react';

import {
   useNodesState,
   useEdgesState,
} from '../../packages/src/hooks/useNodesEdgesState';

// import ReactDiagram from '../../packages/src/container/ReactDiagram';

import { addEdge, updateEdge } from '../../packages/src/utils/graph';

import { MarkerType } from '../../packages/src/components/Edges/type';

import { Connection, Edge } from '../../packages/src/types';

import { ReactDiagram } from 'react-cosmos-diagram';

import 'react-cosmos-diagram/styles/style.css';

import './style.css';

const initialNodes = [
   {
      id: '1',
      // width: 50,
      height: 100,
      data: { label: 'Node1Node1Node1Node1Node1' },
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

   console.log('fix eslint extend error');

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
            multiSelectionKeyCode="z"
            // panning={false}
            minZoom={1}
            maxZoom={2}
            onNodesChange={onNodesChange}
            onNodeDrag={console.log}
            onNodeDragStart={console.log}
            onNodeDragEnd={console.log}
            onNodeClick={console.log}
            onNodeDoubleClick={console.log}
            onNodeContextMenu={console.log}
            onNodeMouseEnter={console.log}
            onNodeMouseMove={console.log}
            onNodeMouseLeave={console.log}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={console.log}
            onEdgeDoubleClick={console.log}
            onEdgeContextMenu={console.log}
            onEdgeMouseEnter={console.log}
            onEdgeMouseMove={console.log}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            // autoPanOnNodeDrag={false}
            // autoPanOnConnect={false}
            onMove={console.log}
            onMoveStart={console.log}
            onMoveEnd={console.log}
            onError={console.log}
            // nodeExtent={[
            //    [-100, -100],
            //    [100, 100],
            // ]}
            // translateExtent={[
            //    [-100, -100],
            //    [100, 100],
            // ]}
         />
      </>
   );
}

export default Index;
