import { memo } from 'react';
import { Position, getBezierPath } from '@diagram/core';

import BaseEdge from './BaseEdge';

import { Edge, EdgeProps } from './type';

interface BezierPathOptions {
   curvature?: number;
}

interface BezierEdgeProps<EdgeType extends Edge = Edge>
   extends EdgeProps<EdgeType> {
   pathOptions?: BezierPathOptions;
}

const BezierEdge = memo(
   ({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition = Position.Bottom,
      targetPosition = Position.Top,
      label,
      labelStyle,
      labelShowBg,
      labelBgStyle,
      labelBgPadding,
      labelBgBorderRadius,
      style,
      markerEnd,
      markerStart,
      pathOptions,
   }: BezierEdgeProps) => {
      const [path, labelX, labelY] = getBezierPath({
         sourceX,
         sourceY,
         sourcePosition,
         targetX,
         targetY,
         targetPosition,
         curvature: pathOptions?.curvature,
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

BezierEdge.displayName = 'BezierEdge';

export default BezierEdge;
