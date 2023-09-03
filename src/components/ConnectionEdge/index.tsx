import { CSSProperties } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from 'hooks/useStore';

import ConnectionPath from './ConnectionPath';

import { ReactDiagramState } from 'types';

type ConnectionEdgeProps = {
   containerStyle?: CSSProperties;
   style?: CSSProperties;
};

const selector = (s: ReactDiagramState) => ({
   nodeId: s.connectionNodeId,
});

function ConnectionEdge({ containerStyle, style }: ConnectionEdgeProps) {
   const { nodeId } = useStore(selector, shallow);
   const isValid = !!nodeId;

   if (!isValid) {
      return null;
   }

   return (
      <svg
         style={containerStyle}
         className="react-diagram__container react-diagram__edges react-diagram__connectionline"
      >
         <g className="react-diagram__connection">
            <ConnectionPath nodeId={nodeId} style={style} />
         </g>
      </svg>
   );
}

export default ConnectionEdge;
