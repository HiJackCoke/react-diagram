import { EdgeProps, getBezierPath } from 'react-cosmos-diagram';

import './style.css';

export default function Edge({
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
   const [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
   });

   return (
      <>
         <defs>
            <linearGradient id="gradient">
               <stop offset="0%" stopColor="yellow"></stop>
               <stop offset="50%" stopColor="hotpink"></stop>
               <stop offset="100%" stopColor="deepskyblue"></stop>
            </linearGradient>
         </defs>

         <path
            id={id}
            className="custom-edge__path gradient"
            style={style}
            d={edgePath}
            markerEnd={markerEnd}
         />
      </>
   );
}
