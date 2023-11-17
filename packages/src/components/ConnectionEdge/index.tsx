import { CSSProperties } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';

import ConnectionPath from './ConnectionPath';

import { ReactDiagramState } from '../ReactDiagramProvider/type';
import { ConnectionEdgeType } from './type';

type ConnectionEdgeProps = {
   containerStyle?: CSSProperties;
   style?: CSSProperties;
   type?: ConnectionEdgeType;
};

const selector = (s: ReactDiagramState) => ({
   nodeId: s.connectionNodeId,
   portType: s.connectionPortType,
});

function ConnectionEdge({ containerStyle, style, type }: ConnectionEdgeProps) {
   const { nodeId, portType } = useStore(selector, shallow);
   const isValid = !!(nodeId && portType);

   if (!isValid) {
      return null;
   }

   return (
      <svg
         style={containerStyle}
         className="react-diagram__container react-diagram__edges react-diagram__connectionline"
      >
         <g className="react-diagram__connection">
            <ConnectionPath
               style={style}
               nodeId={nodeId}
               portType={portType}
               type={type}
            />
         </g>
      </svg>
   );
}

export default ConnectionEdge;
