import Viewport from 'container/Viewport';

import NodeRenderer from 'container/NodeRenderer';
import ReactDiagramProvider from 'components/ReactDiagramProvider';

function Index() {
   return (
      <ReactDiagramProvider>
         <Viewport>
            <NodeRenderer
               // nodeTypes={}
               onlyRenderVisibleElements
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
