import { useState } from 'react';
import Viewport from 'container/Viewport';

import NodeRenderer from 'container/NodeRenderer';
import ReactDiagramProvider from 'components/ReactDiagramProvider';
import StoreUpdater from 'components/StoreUpdater';
import { applyNodeChanges } from 'utils/changes';

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

function Index() {
   const [nodes, setNodes] = useState(initialNodes);

   return (
      <ReactDiagramProvider>
         <StoreUpdater
            rfId="1"
            nodes={nodes}
            gridStep={[100, 100]}
            onNodesChange={(changes) =>
               setNodes(applyNodeChanges(changes, nodes))
            }
         />

         <Viewport>
            <NodeRenderer
               // nodeTypes={}
               onlyRenderVisibleElements={false}
               disableKeyboardA11y={false}
               selectNodesOnDrag
               nodeOrigin={[0, 0]}
               onNodeClick={console.log}
               rfId="1"
            />
         </Viewport>
      </ReactDiagramProvider>
   );
}

export default Index;
