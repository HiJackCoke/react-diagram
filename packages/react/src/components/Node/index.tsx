import Port from '../../components/Port';

import { NodeProps } from './type';

import { Position } from 'cosmos-diagram';

function Nodes({ data }: NodeProps) {
   return (
      <>
         <Port type="target" position={Position.Top} />
         {data.label}
         <Port type="source" position={Position.Bottom} />
      </>
   );
}
export default Nodes;
