import { BaseEdgeProps } from './type';
import EdgeLabel from './EdgeLabel';

import { isNumeric } from '../../utils';

function BaseEdge({
   path,
   labelX,
   labelY,
   label,
   labelStyle,
   labelShowBg,
   labelBgStyle,
   labelBgPadding,
   labelBgBorderRadius,
   style,
   markerEnd,
   markerStart,
}: BaseEdgeProps) {
   return (
      <>
         <path
            style={style}
            d={path}
            fill="none"
            className="react-diagram__edge-path"
            markerEnd={markerEnd}
            markerStart={markerStart}
         />
         {label && isNumeric(labelX) && isNumeric(labelY) ? (
            <EdgeLabel
               x={labelX}
               y={labelY}
               label={label}
               labelStyle={labelStyle}
               labelShowBg={labelShowBg}
               labelBgStyle={labelBgStyle}
               labelBgPadding={labelBgPadding}
               labelBgBorderRadius={labelBgBorderRadius}
            />
         ) : null}
      </>
   );
}
BaseEdge.displayName = 'BaseEdge';

export default BaseEdge;
