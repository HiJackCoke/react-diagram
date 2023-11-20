import { ConnectionEdgeComponentProps } from 'react-cosmos-diagram';

function ConnectionEdge({
   fromX,
   fromY,
   toX,
   toY,
}: ConnectionEdgeComponentProps) {
   return (
      <path
         fill="none"
         strokeWidth={1.5}
         className="animated"
         stroke="blue"
         d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
   );
}

export default ConnectionEdge;
