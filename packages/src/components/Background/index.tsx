import { memo, useRef } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';
import { ReactDiagramState } from '../ReactDiagramProvider/type';

import { BackgroundProps } from './type';
import LinePath from './LinePath';

const selector = (s: ReactDiagramState) => ({
   transform: s.transform,
   rfId: s.rfId,
});

function Background({
   gap = 50,
   lineWidth = 1,
   color = '#000000',
}: BackgroundProps) {
   const ref = useRef<SVGSVGElement>(null);
   const { transform, rfId } = useStore(selector, shallow);

   const gapXY: [number, number] = Array.isArray(gap) ? gap : [gap, gap];
   const scaledGap: [number, number] = [
      gapXY[0] * transform[2] || 1,
      gapXY[1] * transform[2] || 1,
   ];

   const patternOffset = [scaledGap[0] / 2, scaledGap[1] / 2];

   return (
      <svg
         className="react-diagram__container react-diagram__background"
         ref={ref}
      >
         <pattern
            id={`background-${rfId}`}
            x={transform[0] % scaledGap[0]}
            y={transform[1] % scaledGap[1]}
            width={scaledGap[0]}
            height={scaledGap[1]}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(-${patternOffset[0]},-${patternOffset[1]})`}
         >
            <LinePath
               scaledGap={scaledGap}
               color={color}
               lineWidth={lineWidth}
            />
         </pattern>
         <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#${`background-${rfId}`})`}
         />
      </svg>
   );
}

Background.displayName = 'Background';

export default memo(Background);
