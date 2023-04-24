import Viewport from 'container/Viewport';

import NodeRenderer from 'container/NodeRenderer';
import ReactDiagramProvider from 'components/ReactDiagramProvider';

function Index() {
   return (
      <ReactDiagramProvider>
         <Viewport>
            <NodeRenderer />
         </Viewport>
      </ReactDiagramProvider>
   );
}

export default Index;
