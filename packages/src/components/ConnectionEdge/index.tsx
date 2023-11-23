import { CSSProperties } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';

import ConnectionPath from './ConnectionPath';

import { ReactDiagramState } from '../ReactDiagramProvider/type';
import { ConnectionEdgeComponent } from './type';
import { EdgeTypesWrapped } from '../../container/EdgeRenderer/type';

type ConnectionEdgeProps = {
   containerStyle?: CSSProperties;
   edgeTypes: EdgeTypesWrapped;
   component?: ConnectionEdgeComponent;
};

const selector = (s: ReactDiagramState) => ({
   edges: s.edges,
   nodeId: s.connectionNodeId,
   portType: s.connectionPortType,
});

function ConnectionEdge({
   containerStyle,
   edgeTypes,
   component,
}: ConnectionEdgeProps) {
   const { nodeId, portType, edges } = useStore(selector, shallow);
   const isValid = !!(nodeId && portType);

   if (!isValid) {
      return null;
   }

   const currentEdge = edges.find((edge) => edge[portType] === nodeId);

   if (!currentEdge) return null;

   const edgeType = currentEdge?.type
      ? edgeTypes[currentEdge.type]
      : edgeTypes.default;

   return (
      <svg
         style={containerStyle}
         className="react-diagram__container react-diagram__edges react-diagram__connection-line"
      >
         <g className="react-diagram__connection">
            <ConnectionPath
               nodeId={nodeId}
               portType={portType}
               currentEdge={currentEdge}
               Component={component}
               EdgeComponent={edgeType}
            />
         </g>
      </svg>
   );
}

export default ConnectionEdge;
