import { isNumeric } from 'cosmos-diagram';

import EdgeLabel from './EdgeLabel';

import { EdgeProps } from './type';

import { EdgeLabelOptions } from './EdgeLabel';

interface BaseEdgeProps
   extends Pick<EdgeProps, 'style' | 'markerStart' | 'markerEnd'>,
      EdgeLabelOptions {
   labelX?: number;
   labelY?: number;
   path: string;
}

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
