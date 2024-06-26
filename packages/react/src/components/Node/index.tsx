import Port from '../../components/Port';

import { NodeProps } from './type';

import { Position } from '@diagram/core';

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
