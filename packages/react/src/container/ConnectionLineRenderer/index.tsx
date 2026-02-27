import { CSSProperties } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';

import ConnectionPath from './ConnectionPath';

import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';
import { ConnectionLineComponent } from './type';
import { EdgeTypesWrapped } from '../EdgeRenderer/type';
import { Edge } from '../../types';

type ConnectionLineRendererProps<EdgeType extends Edge = Edge> = {
   containerStyle?: CSSProperties;
   edgeTypes: EdgeTypesWrapped<EdgeType>;
   component?: ConnectionLineComponent;
};

const selector = (s: ReactDiagramState) => ({
   edges: s.edges,
   connectionStartPort: s.connectionStartPort,
});

function ConnectionLineRenderer<EdgeType extends Edge = Edge>({
   containerStyle,
   edgeTypes,
   component,
}: ConnectionLineRendererProps<EdgeType>) {
   const { connectionStartPort, edges } = useStore(selector, shallow);
   if (!connectionStartPort) return null;

   const { nodeId, portType } = connectionStartPort;
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
            <ConnectionPath<EdgeType>
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
