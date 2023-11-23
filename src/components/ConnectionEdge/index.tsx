import { ConnectionLineComponentProps } from 'react-cosmos-diagram';

function ConnectionLine({
   fromX,
   fromY,
   toX,
   toY,
}: ConnectionLineComponentProps) {
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

export default ConnectionLine;
