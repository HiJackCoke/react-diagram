import Port from 'components/Port';

import './style.css';

function Nodes() {
   return (
      <>
         <Port type="target" position="top" />
         Node
         <Port type="source" position="bottom" />
      </>
   );
}
export default Nodes;
