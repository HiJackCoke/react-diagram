import Port from '../../components/Port';

import { Node, NodeProps } from './type';

import { Position } from 'cosmos-diagram';

function Nodes<NodeType extends Node = Node>({ data }: NodeProps<NodeType>) {
   return (
      <>
         <Port type="target" position={Position.Top} />
         {data.label}
         <Port type="source" position={Position.Bottom} />
      </>
   );
}
export default Nodes;
