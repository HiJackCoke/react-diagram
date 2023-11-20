import { CSSProperties } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';

import ConnectionPath from './ConnectionPath';

import { ReactDiagramState } from '../ReactDiagramProvider/type';
import { ConnectionEdgeComponent, ConnectionEdgeType } from './type';

type ConnectionEdgeProps = {
   containerStyle?: CSSProperties;
   style?: CSSProperties;
   type?: ConnectionEdgeType;
   component?: ConnectionEdgeComponent;
};

const selector = (s: ReactDiagramState) => ({
   edges: s.edges,
   nodeId: s.connectionNodeId,
   portType: s.connectionPortType,
});

function ConnectionEdge({
   containerStyle,
   style,
   type,
   component,
}: ConnectionEdgeProps) {
   const { nodeId, portType, edges } = useStore(selector, shallow);
   const isValid = !!(nodeId && portType);

   if (!isValid) {
      return null;
   }

   const capitalizeFirstLetter = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

   const getConnectionEdgeType = (edgeType = '') => {
      let connectionEdgeType = '';

      if (type) {
         connectionEdgeType = type;
      } else if (
         Object.keys(ConnectionEdgeType).includes(
            capitalizeFirstLetter(edgeType),
         )
      ) {
         connectionEdgeType = edgeType;
      } else {
         connectionEdgeType = 'straight';
      }

      return connectionEdgeType as ConnectionEdgeType;
   };

   const currentEdgeType = edges.find((edge) => edge[portType] === nodeId)
      ?.type;

   const edgeType = getConnectionEdgeType(currentEdgeType);

   return (
      <svg
         style={containerStyle}
         className="react-diagram__container react-diagram__edges react-diagram__connection-line"
      >
         <g className="react-diagram__connection">
            <ConnectionPath
               style={style}
               nodeId={nodeId}
               portType={portType}
               type={edgeType}
               Component={component}
            />
         </g>
      </svg>
   );
}

export default ConnectionEdge;
