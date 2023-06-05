import Viewport from 'container/Viewport';

import { useNodeOrEdgeTypes } from 'hooks/useNodeOrEdgeTypes';
import { useNodesState, useEdgesState } from 'hooks/useNodesEdgesState';

import DiagramRenderer from 'container/DiagramRenderer';
import { createNodeTypes } from 'container/NodeRenderer/utils';
import { createEdgeTypes } from 'container/EdgeRenderer/utils';

import NodeRenderer from 'container/NodeRenderer';
import EdgeRenderer from 'container/EdgeRenderer';

import ReactDiagramProvider from 'components/ReactDiagramProvider';
import StoreUpdater from 'components/StoreUpdater';
import Nodes from 'components/Node';
import StepEdge from 'components/Edges/StepEdge';

import { MarkerType } from 'components/Edges/type';

import { CoordinateExtent, EdgeTypes } from 'types';
import { NodeTypes } from 'container/NodeRenderer/type';

const initialNodes = [
   {
      id: '1',
      data: { label: 'An input node' },
      position: { x: 0, y: 0 },
   },
   {
      id: '2',
      data: { label: 'Output A' },
      position: { x: 300, y: 50 },
   },
   {
      id: '3',
      data: { label: 'Output A' },
      position: { x: 650, y: 25 },
   },
   {
      id: '4',
      data: { label: 'Output B' },
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
   },
   {
      id: 'e-3-4',
      source: '3',
      target: '4',
      markerEnd: {
         type: MarkerType.Arrow,
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

function Index() {
   const nodeTypesWrapped = useNodeOrEdgeTypes(
      defaultNodeTypes,
      createNodeTypes,
   );
   const edgeTypesWrapped = useNodeOrEdgeTypes(
      defaultEdgeTypes,
      createEdgeTypes,
   );

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [edges, _setEdges, onEdgesChange] = useEdgesState(initialEdges);

   return (
      <ReactDiagramProvider>
         <div className="react-diagram">
            <StoreUpdater
               rfId="1"
               nodes={nodes}
               edges={edges}
               // gridStep={[100, 100]}
               onNodesChange={onNodesChange}
               onEdgesChange={onEdgesChange}
            />

            <DiagramRenderer
               minZoom={minZoom}
               maxZoom={maxZoom}
               translateExtent={translateExtent}
               defaultViewport={defaultViewport}
            >
               <Viewport>
                  <NodeRenderer
                     nodeTypes={nodeTypesWrapped}
                     onlyRenderVisibleElements={false}
                     disableKeyboardA11y={false}
                     selectNodesOnDrag
                     nodeOrigin={[0, 0]}
                     onNodeClick={console.log}
                     rfId="1"
                  />
                  <EdgeRenderer edgeTypes={edgeTypesWrapped} rfId="1" />
               </Viewport>
            </DiagramRenderer>
         </div>
      </ReactDiagramProvider>
   );
}

export default Index;
