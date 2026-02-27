import { isNumeric } from 'cosmos-diagram';

import EdgeLabel from './EdgeLabel';

import { Edge, EdgeProps } from './type';

import { EdgeLabelOptions } from './EdgeLabel';

type BaseEdgeProps<EdgeType extends Edge = Edge> = Pick<
   EdgeProps<EdgeType>,
   'style' | 'markerStart' | 'markerEnd'
> &
   EdgeLabelOptions & {
      labelX?: number;
      labelY?: number;
      path: string;
   };

function BaseEdge<EdgeType extends Edge = Edge>({
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
}: BaseEdgeProps<EdgeType>) {
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
