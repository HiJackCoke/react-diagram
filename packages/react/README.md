# react-cosmos-diagram

[![npm version](https://img.shields.io/npm/v/react-cosmos-diagram)](https://www.npmjs.com/package/react-cosmos-diagram)
[![license](https://img.shields.io/npm/l/react-cosmos-diagram)](https://github.com/taehunlim/react-diagram/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-supported-blue)](https://www.typescriptlang.org/)

A highly customizable React library for building node-based diagrams and graph UIs.
[→ Live demo](https://codesandbox.io/p/devbox/headless-darkness-nqdfz2)

---

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Quickstart](#quickstart)
- [Custom Nodes](#custom-nodes)
- [Custom Edges](#custom-edges)
- [Custom Connection Line](#custom-connection-line)
- [Components](#components)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Props Reference](#props-reference)
- [TypeScript Generics](#typescript-generics)
- [Credits](#credits)
- [License](#license)

---

## Installation

```bash
npm install react-cosmos-diagram
```

Import the stylesheet once at your app entry point:

```tsx
import 'react-cosmos-diagram/styles/style.css';
```

**Peer requirements:** React >= 17, React DOM >= 17

---

## Features

- Zoom, pan, drag, multi-select, and keyboard shortcuts supported natively
- Fully customizable nodes, edges, and ports with TypeScript generics
- Nested nodes via `parentNode`
- Drag-selection box (default key: `Shift`)
- Auto-panning during node drag and edge connection
- `onlyRenderVisibleElements` for large-diagram performance
- `Background` component for grid overlays
- Grid snapping via `gridStep`

---

## Quickstart

### Minimal example

```tsx
import ReactDiagram, { useNodesState, useEdgesState, addEdge } from 'react-cosmos-diagram';
import 'react-cosmos-diagram/styles/style.css';
import { useCallback } from 'react';
import type { Connection } from 'react-cosmos-diagram';

const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 300, y: 100 }, data: { label: 'Node 2' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactDiagram
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
}
```

> `ReactDiagram` needs a container with explicit `width` and `height`.

### Full example with edge reconnection

```tsx
import { useCallback, useRef } from 'react';

import ReactDiagram, {
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  Connection,
  Edge,
  MarkerType,
  PortType,
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
    markerStart: { type: MarkerType.Arrow },
  },
  {
    id: 'e-2-3',
    source: '2',
    target: '3',
    markerEnd: { type: MarkerType.Arrow },
    type: 'step',
    label: 'label',
  },
  {
    id: 'e-3-4',
    type: 'step',
    source: '3',
    target: '4',
    markerEnd: { type: MarkerType.Arrow },
  },
];

function Diagram() {
  const edgeConnected = useRef(true);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((edges) => addEdge({ ...params }, edges)),
    [],
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeConnected.current = false;
  }, []);

  const onEdgeUpdateEnd = useCallback(
    (_e: MouseEvent, currentEdge: Edge, _portType: PortType) => {
      if (!edgeConnected.current) {
        setEdges((edges) => edges.filter((edge) => edge.id !== currentEdge.id));
      }
      edgeConnected.current = true;
    },
    [],
  );

  const onEdgeUpdate = useCallback(
    (originEdge: Edge, newConnection: Connection) => {
      edgeConnected.current = true;
      setEdges((edges) => updateEdge(originEdge, newConnection, edges));
    },
    [],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
    </div>
  );
}

export default Diagram;
```

---

## Custom Nodes

Use `NodeProps<YourNodeType>` to get typed props. Place `Port` components inside to define connection points.

```tsx
import { memo } from 'react';
import { Port, NodeProps, Node } from 'react-cosmos-diagram';
import { Position } from 'react-cosmos-diagram';

type MyNodeData = { label: string; color?: string };
type MyNode = Node<MyNodeData, 'myNode'>;

function MyNode({ data }: NodeProps<MyNode>) {
  return (
    <div style={{ padding: 10, background: data.color ?? '#fff', border: '1px solid #ccc' }}>
      <Port type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Port type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(MyNode);
```

Register custom nodes in `nodeTypes` (define outside the component to avoid recreation):

```tsx
import { nodeTypes } from './nodeTypes';

const nodeTypes = { myNode: MyNode };

<ReactDiagram nodes={nodes} nodeTypes={nodeTypes} ... />
```

---

## Custom Edges

Use `EdgeProps<YourEdgeType>` along with `BaseEdge` and `getBezierPath`:

```tsx
import { memo } from 'react';
import { BaseEdge, EdgeProps, Edge, getBezierPath } from 'react-cosmos-diagram';
import { Position } from 'react-cosmos-diagram';

type MyEdgeData = { animated?: boolean };
type MyEdge = Edge<MyEdgeData, 'myEdge'>;

function MyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
  style,
  markerEnd,
}: EdgeProps<MyEdge>) {
  const [path, labelX, labelY, offsetX, offsetY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      path={path}
      labelX={labelX}
      labelY={labelY}
      style={style}
      markerEnd={markerEnd}
    />
  );
}

export default memo(MyEdge);
```

Register in `edgeTypes`:

```tsx
const edgeTypes = { myEdge: MyEdge };

<ReactDiagram edges={edges} edgeTypes={edgeTypes} ... />
```

---

## Custom Connection Line

Provide a `ConnectionLineComponent` prop to render a custom line while the user is dragging a new connection:

```tsx
import type { ConnectionLineComponentProps } from 'react-cosmos-diagram';

function CustomConnectionLine({ fromX, fromY, toX, toY }: ConnectionLineComponentProps) {
  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={2}
        d={`M${fromX},${fromY} C${fromX},${toY} ${toX},${fromY} ${toX},${toY}`}
      />
      <circle cx={toX} cy={toY} r={4} fill="#222" />
    </g>
  );
}

<ReactDiagram ConnectionLineComponent={CustomConnectionLine} ... />
```

---

## Components

| Component | Description |
|---|---|
| `ReactDiagram` | Main diagram canvas. Default export. |
| `ReactDiagramProvider` | Context provider for accessing the store outside the canvas. |
| `Port` | Connection port placed inside a custom node. |
| `BaseEdge` | SVG edge primitive used inside custom edges. |
| `BezierEdge` | Built-in bezier curve edge. |
| `StepEdge` | Built-in right-angle step edge. |
| `Background` | Background grid component. |

---

## Hooks

### `useNodesState<NodeType>(initialNodes)`

```ts
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
```

Returns `[NodeType[], Dispatch<SetStateAction<NodeType[]>>, OnNodesChange<NodeType>]`.

### `useEdgesState<EdgeType>(initialEdges)`

```ts
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
```

Returns `[EdgeType[], Dispatch<SetStateAction<EdgeType[]>>, OnEdgesChange<EdgeType>]`.

### `useStore(selector)`

Zustand selector hook for reading internal diagram state from within the canvas.

### `useStoreApi()`

Returns `{ getState, setState, subscribe }` — use when you need imperative access to the store, e.g. from event handlers outside the React tree.

---

## Utilities

### Edge paths

| Function | Returns | Description |
|---|---|---|
| `getBezierPath(params)` | `[path, labelX, labelY, offsetX, offsetY]` | Bezier SVG path + label position |
| `getBezierEdgeCenter(params)` | `[centerX, centerY, offsetX, offsetY]` | Center point of a bezier edge |
| `getStepPath(params)` | `[path, labelX, labelY, offsetX, offsetY]` | Right-angle step path |
| `getStraightPath(params)` | `[path, labelX, labelY, offsetX, offsetY]` | Straight-line path |

### Edge state

| Function | Description |
|---|---|
| `addEdge(connection, edges)` | Appends a new edge from a `Connection` object |
| `updateEdge(oldEdge, newConnection, edges)` | Replaces an edge's source/target with a new connection |

### Type guards

| Function | Description |
|---|---|
| `isCoreNode(element)` | Returns `true` if the value is a `CoreNode` |
| `isCoreEdge(element)` | Returns `true` if the value is a `CoreEdge` |

### Geometry

| Function | Description |
|---|---|
| `clamp(value, min, max)` | Clamps a number between min and max |
| `rectToBox(rect)` | Converts `Rect` to `Box` |
| `boxToRect(box)` | Converts `Box` to `Rect` |

---

## Props Reference

### Data

| Prop | Type | Description |
|---|---|---|
| `nodes` | `NodeType[]` | Array of node objects |
| `edges` | `EdgeType[]` | Array of edge objects |
| `nodeTypes` | `NodeTypes<NodeType>` | Map of type name → custom node component |
| `edgeTypes` | `EdgeTypes<EdgeType>` | Map of type name → custom edge component |

### Change Handlers

| Prop | Type | Description |
|---|---|---|
| `onNodesChange` | `OnNodesChange<NodeType>` | Called on node position, selection, dimension, or removal changes |
| `onEdgesChange` | `OnEdgesChange<EdgeType>` | Called on edge selection or removal changes |

### Connection

| Prop | Type | Default | Description |
|---|---|---|---|
| `onConnect` | `(connection: Connection) => void` | — | Called when a new connection is completed |
| `onConnectStart` | `OnConnectStart` | — | Called when the user starts dragging a connection |
| `onConnectEnd` | `OnConnectEnd` | — | Called when the connection drag ends |
| `connectionRadius` | `number` | — | Snap radius around a port for completing a connection |
| `ConnectionLineComponent` | `ConnectionLineComponent` | — | Custom component for the in-progress connection line |

### Node Events

| Prop | Type |
|---|---|
| `onNodeClick` | `(event: MouseEvent, node: NodeType) => void` |
| `onNodeDoubleClick` | `(event: MouseEvent, node: NodeType) => void` |
| `onNodeContextMenu` | `(event: MouseEvent, node: NodeType) => void` |
| `onNodeMouseEnter` | `(event: MouseEvent, node: NodeType) => void` |
| `onNodeMouseMove` | `(event: MouseEvent, node: NodeType) => void` |
| `onNodeMouseLeave` | `(event: MouseEvent, node: NodeType) => void` |
| `onNodeDragStart` | `NodeDragHandler<NodeType>` |
| `onNodeDrag` | `NodeDragHandler<NodeType>` |
| `onNodeDragEnd` | `NodeDragHandler<NodeType>` |

### Edge Events

| Prop | Type |
|---|---|
| `onEdgeClick` | `(event: MouseEvent, edge: EdgeType) => void` |
| `onEdgeDoubleClick` | `EdgeMouseHandler<EdgeType>` |
| `onEdgeContextMenu` | `EdgeMouseHandler<EdgeType>` |
| `onEdgeMouseEnter` | `EdgeMouseHandler<EdgeType>` |
| `onEdgeMouseMove` | `EdgeMouseHandler<EdgeType>` |
| `onEdgeMouseLeave` | `EdgeMouseHandler<EdgeType>` |
| `onEdgeUpdate` | `(oldEdge: EdgeType, newConnection: Connection) => void` |
| `onEdgeUpdateStart` | `(event: MouseEvent, edge: EdgeType, portType: PortType) => void` |
| `onEdgeUpdateEnd` | `(event: MouseEvent, edge: EdgeType, portType: PortType) => void` |

### Viewport

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultViewport` | `Viewport` | `{ x:0, y:0, zoom:1 }` | Initial viewport position and zoom |
| `minZoom` | `number` | `0.5` | Minimum zoom level |
| `maxZoom` | `number` | `2` | Maximum zoom level |
| `translateExtent` | `CoordinateExtent` | — | Restricts how far the viewport can be panned |
| `nodeExtent` | `CoordinateExtent` | — | Restricts how far nodes can be dragged |
| `panning` | `boolean` | `true` | Enable/disable viewport panning |

### Behavior

| Prop | Type | Default | Description |
|---|---|---|---|
| `nodesDraggable` | `boolean` | `true` | Allow nodes to be dragged |
| `elevateNodesOnSelect` | `boolean` | — | Raise selected nodes above others |
| `autoPanOnNodeDrag` | `boolean` | `true` | Auto-pan when dragging a node near the edge |
| `autoPanOnConnect` | `boolean` | `true` | Auto-pan when dragging a connection near the edge |
| `onlyRenderVisibleElements` | `boolean` | `false` | Skip rendering off-screen nodes and edges |
| `multiSelectionKeyCode` | `KeyCode` | `'Meta'` | Key to hold for multi-select |
| `dragSelectionKeyCode` | `KeyCode` | `'Shift'` | Key to hold for drag-selection box |
| `noDragClassName` | `string` | `'nodrag'` | Elements with this class won't trigger node drag |
| `noPanClassName` | `string` | `'nopan'` | Elements with this class won't trigger panning |
| `smoothStep` | `boolean` | — | Use smooth corners on step edges |
| `centerStep` | `boolean` | — | Center the step path between source and target |
| `gridStep` | `GridStep` | — | Snap nodes to a grid while dragging |

---

## TypeScript Generics

v0.10.0 improved generic inference so that custom `Node` and `Edge` types flow through hooks and the `ReactDiagram` component without manual casting.

```tsx
import ReactDiagram, {
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
} from 'react-cosmos-diagram';
import { useCallback } from 'react';
import type { Connection } from 'react-cosmos-diagram';

// 1. Define typed Node and Edge
type AppNode = Node<{ label: string; color: string }, 'colored'>;
type AppEdge = Edge<{ weight: number }, 'weighted'>;

const initialNodes: AppNode[] = [
  { id: '1', type: 'colored', position: { x: 0, y: 0 }, data: { label: 'A', color: 'red' } },
  { id: '2', type: 'colored', position: { x: 200, y: 0 }, data: { label: 'B', color: 'blue' } },
];

const initialEdges: AppEdge[] = [
  { id: 'e1-2', source: '1', target: '2', data: { weight: 5 } },
];

export default function TypedDiagram() {
  // 2. Hooks infer AppNode / AppEdge from initial values
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, data: { weight: 1 } }, eds)),
    [],
  );

  // 3. ReactDiagram<AppNode, AppEdge> is inferred — nodeTypes and event handlers
  //    are fully typed without explicit generics.
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactDiagram
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_e, node) => console.log(node.data.color)} // typed!
      />
    </div>
  );
}
```

---

## Credits

Under the hood, react-cosmos-diagram depends on these great libraries:

- [d3-zoom](https://github.com/d3/d3-zoom) — zoom, pan and drag interactions
- [d3-drag](https://github.com/d3/d3-drag) — node dragging
- [zustand](https://github.com/pmndrs/zustand) — internal state management

---

## License

React Cosmos Diagram is [MIT licensed](https://github.com/taehunlim/react-diagram/blob/main/LICENSE).
