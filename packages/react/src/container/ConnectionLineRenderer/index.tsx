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
   nodeId: s.connectionNodeId,
   portType: s.connectionPortType,
});

function ConnectionLineRenderer({
   containerStyle,
   edgeTypes,
   component,
}: ConnectionLineRendererProps) {
   const { nodeId, portType, edges } = useStore(selector, shallow);
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
