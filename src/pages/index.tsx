import { useNodeOrEdgeTypes } from 'hooks/useNodeOrEdgeTypes';
import { useNodesState, useEdgesState } from 'hooks/useNodesEdgesState';

import { createNodeTypes } from 'container/NodeRenderer/utils';
import { createEdgeTypes } from 'container/EdgeRenderer/utils';

import ReactDiagramProvider from 'components/ReactDiagramProvider';
import StoreUpdater from 'components/StoreUpdater';
import Nodes from 'components/Node';
import StepEdge from 'components/Edges/StepEdge';

import { MarkerType } from 'components/Edges/type';

import { CoordinateExtent } from 'types';
import { NodeTypes } from 'container/NodeRenderer/type';
import { EdgeTypes } from 'container/EdgeRenderer/type';

import './style.css';
import ReactDiagram from 'container/ReactDiagram/DiagramView';

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

const minZoom = 0.5;
const maxZoom = 2;
const translateExtent: CoordinateExtent = [
   [-Infinity, -Infinity],
   [Infinity, Infinity],
];
const defaultViewport = {
   x: 0,
   y: 0,
   zoom: 1,
};

const defaultNodeTypes: NodeTypes = {
   default: Nodes,
};

const defaultEdgeTypes: EdgeTypes = {
   step: StepEdge,
};

let idIndex = 5;

function Index() {
   const nodeTypesWrapped = useNodeOrEdgeTypes(
      defaultNodeTypes,
      createNodeTypes,
   );
   const edgeTypesWrapped = useNodeOrEdgeTypes(
      defaultEdgeTypes,
      createEdgeTypes,
   );

   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [edges, _setEdges, onEdgesChange] = useEdgesState(initialEdges);

   const addNode = () => {
      const newNode = {
         id: `${idIndex}`,
         data: { label: `node${idIndex}` },
         position: { x: Math.random() * 1000, y: Math.random() * 1000 },
      };

      setNodes((nodes) => [...nodes, newNode]);

      idIndex++;
   };

   return (
      <>
         <button
            style={{ position: 'fixed', zIndex: '9999' }}
            onClick={addNode}
         >
            Add Node
         </button>
         <ReactDiagramProvider>
            <div className="react-diagram">
               <StoreUpdater
                  rfId="1"
                  nodes={nodes}
                  edges={edges}
                  // gridStep={[100, 100]}
                  nodesDraggable={true}
                  elevateNodesOnSelect={true}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
               />

               <ReactDiagram
                  rfId="1"
                  minZoom={minZoom}
                  maxZoom={maxZoom}
                  translateExtent={translateExtent}
                  defaultViewport={defaultViewport}
                  onlyRenderVisibleElements={false}
                  disableKeyboardA11y={false}
                  nodeOrigin={[0, 0]}
                  nodeTypes={nodeTypesWrapped}
                  edgeTypes={edgeTypesWrapped}
                  onNodeClick={console.log}
               />
            </div>
         </ReactDiagramProvider>
      </>
   );
}

export default Index;
