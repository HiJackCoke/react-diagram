import { useState } from 'react';
import Viewport from 'container/Viewport';

import { useNodeOrEdgeTypes } from 'hooks/useNodeOrEdgeTypes';

import ReactDiagramProvider from 'components/ReactDiagramProvider';
import StoreUpdater from 'components/StoreUpdater';
import ZoomPane from 'container/ZoomPane';

import NodeRenderer from 'container/NodeRenderer';
import { createNodeTypes } from 'container/NodeRenderer/utils';
import Nodes from 'components/Node';

import { applyNodeChanges } from 'utils/changes';

import { CoordinateExtent, NodeTypes } from 'types';

const initialNodes = [
   {
      id: '1',
      data: { label: 'An input node' },
      position: { x: 0, y: 50 },
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

function Index() {
   const nodeTypesWrapped = useNodeOrEdgeTypes(
      defaultNodeTypes,
      createNodeTypes,
   );

   const [nodes, setNodes] = useState(initialNodes);

   return (
      <ReactDiagramProvider>
         <div className="react-diagram">
            <StoreUpdater
               rfId="1"
               nodes={nodes}
               gridStep={[100, 100]}
               onNodesChange={(changes) =>
                  setNodes((nodes) => applyNodeChanges(changes, nodes))
               }
            />

            <ZoomPane
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
               </Viewport>
            </ZoomPane>
         </div>
      </ReactDiagramProvider>
   );
}

export default Index;
