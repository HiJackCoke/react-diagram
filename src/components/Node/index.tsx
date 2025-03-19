import { NodeProps, Port, Position } from 'react-cosmos-diagram';
import './style.css';
import { ReactNode } from 'react';

function Node({
   data, // intersected,
} // selected,
: NodeProps<{ element: ReactNode }>) {
   return (
      <div className="custom-node__container">
         <Port position={Position.Left} type="target" />
         <div className="custom-node__wrapper">{data.element}</div>
         <Port position={Position.Right} type="source" />
      </div>
   );
}

export default Node;
