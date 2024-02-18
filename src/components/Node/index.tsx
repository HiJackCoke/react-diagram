import { NodeProps, Port, Position } from 'react-cosmos-diagram';
import './style.css';

function Node({ data, selected, intersected }: NodeProps) {
   return (
      <div className="custom-node__container">
         <Port position={Position.Left} type="target" />
         <div className="custom-node__wrapper">
            {data.label}
            <input />
         </div>
         <Port position={Position.Right} type="source" />
      </div>
   );
}

export default Node;
