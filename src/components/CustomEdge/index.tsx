import { EdgeProps, getBezierPath } from 'react-cosmos-diagram';

export default function CustomEdge({
   id,
   sourceX,
   sourceY,
   targetX,
   targetY,
   sourcePosition,
   targetPosition,
   style = {},
   markerEnd,
}: EdgeProps) {
   const xEqual = sourceX === targetX;
   const yEqual = sourceY === targetY;

   const [edgePath] = getBezierPath({
      sourceX: xEqual ? sourceX + 0.0001 : sourceX,
      sourceY: yEqual ? sourceY + 0.0001 : sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
   });

   return (
      <>
         <path
            id={id}
            className="customEdge"
            style={style}
            d={edgePath}
            markerEnd={markerEnd}
         />
      </>
   );
}
