import Port from 'components/Port';

import './style.css';

function Nodes() {
   return (
      <div className="react-diagram__node react-diagram__node-default">
         <Port position="top" />
         Node
         <Port position="bottom" />
      </div>
   );
}
export default Nodes;
