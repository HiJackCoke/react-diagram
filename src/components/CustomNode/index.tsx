import { NodeProps, Port, Position } from 'react-cosmos-diagram';

function CustomNode(props: NodeProps) {
   return (
      <div style={{ height: '100%', background: 'rgba(0, 0, 0, 0.1)' }}>
         <Port position={Position.Top} type="target" />
         {props.data.label}
         <Port position={Position.Bottom} type="source" />
      </div>
   );
}

export default CustomNode;
