import { memo } from 'react';
import { getStraightPath } from 'cosmos-diagram';

import BaseEdge from './BaseEdge';

import type { EdgeProps } from '../../types';

const StraightEdge = memo(
   ({
      sourceX,
      sourceY,
      targetX,
      targetY,
      label,
      labelStyle,
      labelShowBg,
      labelBgStyle,
      labelBgPadding,
      labelBgBorderRadius,
      style,
      markerEnd,
      markerStart,
   }: EdgeProps) => {
      const [path, labelX, labelY] = getStraightPath({
         sourceX,
         sourceY,
         targetX,
         targetY,
      });

      return (
         <BaseEdge
            path={path}
            labelX={labelX}
            labelY={labelY}
            label={label}
            labelStyle={labelStyle}
            labelShowBg={labelShowBg}
            labelBgStyle={labelBgStyle}
            labelBgPadding={labelBgPadding}
            labelBgBorderRadius={labelBgBorderRadius}
            style={style}
            markerEnd={markerEnd}
            markerStart={markerStart}
         />
      );
   },
);

StraightEdge.displayName = 'StraightEdge';

export default StraightEdge;
