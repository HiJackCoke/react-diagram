import Port from 'components/Port';

import { NodeProps } from './type';

import './style.css';

function Nodes({ data }: NodeProps) {
   return (
      <>
         <Port type="target" position="top" />
         {data.label}
         <Port type="source" position="bottom" />
      </>
   );
}
export default Nodes;
