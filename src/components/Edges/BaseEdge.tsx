import { BaseEdgeProps } from 'types/edges';

import './style.css';

const BaseEdge = ({ path, style, markerEnd, markerStart }: BaseEdgeProps) => (
   <>
      <path
         style={style}
         d={path}
         fill="none"
         className="react-diagram__edge-path"
         markerEnd={markerEnd}
         markerStart={markerStart}
      />
   </>
);

BaseEdge.displayName = 'BaseEdge';

export default BaseEdge;
