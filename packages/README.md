## Installation

```bash
npm install react-cosmos-diagram
```

## Core characteristics

-  Easy zooming and panning, single and multiple selection of graph elements and keyboard shortcuts are supported natively
-  Customizable support for nodes, ports, and edges
-  Written in [Typescript](https://www.typescriptlang.org/)

## [demo](https://codesandbox.io/p/sandbox/blue-framework-hv666c?file=%2Fsrc%2FApp.tsx%3A47%2C66)

## Quickstart

```jsx
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

import 'react-cosmos-diagram/styles/style.css';

const initialNodes = [
   {
      id: '1',
      width: 200,
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
   },
];

function Diagram() {
   const edgeConnected = useRef(true);

   const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

   const onConnect = useCallback(
      (params: Connection) => setEdges((edges) => addEdge({ ...params }, edges)),
      [],
   );

   const onEdgeUpdateStart = useCallback(() => {
      edgeConnected.current = false;
   }, []);

   const onEdgeUpdateEnd = useCallback((_e: any, currentEdge: Edge) => {
      if (!edgeConnected.current) {
         setEdges((edges) => edges.filter((edge) => edge.id !== currentEdge.id));
      }

      edgeConnected.current = true;
   }, []);

   const onEdgeUpdate = useCallback(
      (originEdge: Edge, newConnection: Connection) => {
         edgeConnected.current = true;
         setEdges((edges) => updateEdge(originEdge, newConnection, edges));
      },
      [],
   );

   return (
      <ReactDiagram
         nodes={nodes}
         edges={edges}
         onNodesChange={onNodesChange}
         onEdgesChange={onEdgesChange}
         onConnect={onConnect}
         onEdgeUpdateStart={onEdgeUpdateStart}
         onEdgeUpdateEnd={onEdgeUpdateEnd}
         onEdgeUpdate={onEdgeUpdate}
      />
   );
}

export default Diagram;

```

## Credits

Under the hood, React Cosmos Diagram depends on these great libraries:

-  [d3-zoom](https://github.com/d3/d3-zoom) - used for zoom, pan and drag interactions with the graph canvas
-  [d3-drag](https://github.com/d3/d3-drag) - used for making the nodes draggable
-  [zustand](https://github.com/pmndrs/zustand) - internal state management

## License

React Cosmos Diagram is [MIT licensed](https://github.com/taehunlim/react-diagram/blob/main/LICENSE).
