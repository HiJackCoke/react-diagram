import { useCallback, useRef } from 'react';

import ReactDiagram, {
   useNodesState,
   useEdgesState,
   addEdge,
   updateEdge,
   Connection,
   Edge,
   MarkerType,
   Background,
} from 'react-cosmos-diagram';

import CustomNode from 'components/Node';
import CustomEdge from 'components/Edge';

import 'react-cosmos-diagram/dist/style.css';

const nodeTypes = {
   c: CustomNode,
};

const edgeTypes = {
   c: CustomEdge,
};

const initialNodes = [
   {
      id: '1',
      type: 'c',
      // width: 100,
      // height: 100,
      data: { label: 'Custom Node' },
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
      parentNode: '1',
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

   const onConnect = useCallback((params: Connection) => {
      console.log(params);
      setEdges((eds) => addEdge({ ...params }, eds));
   }, []);

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
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            // ConnectionLineComponent={ConnectionLine}
            // multiSelectionKeyCode="z"
            // panning={false}
            // edgeUpdaterRadius={30}
            connectionRadius={30}
            minZoom={1}
            maxZoom={2}
            onNodesChange={(e) => {
               e.forEach((element) => {
                  if (element.type === 'intersect') console.log(e);
               });

               e.forEach((element) => {
                  if (element.type === 'select') console.log(e);
               });
               onNodesChange(e);
            }}
            // onNodeDrag={(a, node) => {
            //    console.log(node);
            // }}
            // onNodeDragStart={console.log}
            // onNodeDragEnd={console.log}
            // onNodeClick={console.log}
            // onNodeDoubleClick={console.log}
            // onNodeContextMenu={console.log}
            // onNodeMouseEnter={console.log}
            // onNodeMouseMove={console.log}
            // onNodeMouseLeave={console.log}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            // onEdgeClick={console.log}
            // onEdgeDoubleClick={console.log}
            // onEdgeContextMenu={console.log}
            // onEdgeMouseEnter={console.log}
            // onEdgeMouseMove={console.log}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            // autoPanOnNodeDrag={false}
            // autoPanOnConnect={false}
            // onMove={console.log}
            // onMoveStart={console.log}
            // onMoveEnd={console.log}
            // onError={console.log}
            // nodeExtent={[
            //    [-100, -100],
            //    [100, 100],
            // ]}
            // translateExtent={[
            //    [-100, -100],
            //    [100, 100],
            // ]}
            centerStep
            smoothStep
            gridStep={[150, 150]}
         >
            <Background />
         </ReactDiagram>
      </>
   );
}

export default Index;
