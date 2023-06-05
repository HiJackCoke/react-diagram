import { memo, useRef, useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import cc from 'classcat';

import { EdgeLabelProps } from './type';
import { Rect } from 'types';

function EdgeLabel({
   x,
   y,
   label,
   labelStyle = {},
   labelShowBg = true,
   labelBgStyle = {},
   labelBgPadding = [2, 4],
   labelBgBorderRadius = 2,
   children,
   className,
   ...rest
}: PropsWithChildren<EdgeLabelProps>) {
   const edgeRef = useRef<SVGTextElement>(null);
   const [edgeLabelBox, setEdgeLabelBox] = useState<Rect>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
   });
   const edgeTextClasses = cc(['react-diagram__edge-textwrapper', className]);

   useEffect(() => {
      if (edgeRef.current) {
         const textBbox = edgeRef.current.getBBox();

         setEdgeLabelBox({
            x: textBbox.x,
            y: textBbox.y,
            width: textBbox.width,
            height: textBbox.height,
         });
      }
   }, [label]);

   if (typeof label === 'undefined' || !label) {
      return null;
   }

   return (
      <g
         transform={`translate(${x - edgeLabelBox.width / 2} ${
            y - edgeLabelBox.height / 2
         })`}
         className={edgeTextClasses}
         visibility={edgeLabelBox.width ? 'visible' : 'hidden'}
         {...rest}
      >
         {labelShowBg && (
            <rect
               width={edgeLabelBox.width + 2 * labelBgPadding[0]}
               x={-labelBgPadding[0]}
               y={-labelBgPadding[1]}
               height={edgeLabelBox.height + 2 * labelBgPadding[1]}
               className="react-diagram__edge-textbg"
               style={labelBgStyle}
               rx={labelBgBorderRadius}
               ry={labelBgBorderRadius}
            />
         )}
         <text
            className="react-diagram__edge-text"
            y={edgeLabelBox.height / 2}
            dy="0.3em"
            ref={edgeRef}
            style={labelStyle}
         >
            {label}
         </text>
         {children}
      </g>
   );
}
export default memo(EdgeLabel);
