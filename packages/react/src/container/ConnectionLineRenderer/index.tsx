import { CSSProperties } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';

import ConnectionPath from './ConnectionPath';

import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';
import { ConnectionLineComponent } from './type';
import { EdgeTypesWrapped } from '../EdgeRenderer/type';

type ConnectionLineRendererProps = {
   containerStyle?: CSSProperties;
   edgeTypes: EdgeTypesWrapped;
   component?: ConnectionLineComponent;
};

const selector = (s: ReactDiagramState) => ({
   edges: s.edges,
   startPort: s.connectionStartPort,
});

function ConnectionLineRenderer({
   containerStyle,
   edgeTypes,
   component,
}: ConnectionLineRendererProps) {
   const { startPort, edges } = useStore(selector, shallow);
   if (!startPort) return null;

   const { nodeId, portType } = startPort;
   const isValid = !!(nodeId && portType);

   if (!isValid) {
      return null;
   }

   const selectedEdge = edges.find((edge) => edge[portType] === nodeId);

   const EdgeWrapper = selectedEdge?.type
      ? edgeTypes[selectedEdge.type]
      : edgeTypes.default;

   return (
      <svg
         style={containerStyle}
         className="react-diagram__container react-diagram__connection-line"
      >
         <g className="react-diagram__connection">
            <ConnectionPath
               nodeId={nodeId}
               portType={portType}
               edge={selectedEdge}
               Component={component}
               EdgeWrapper={EdgeWrapper}
            />
         </g>
      </svg>
   );
}

export default ConnectionLineRenderer;
