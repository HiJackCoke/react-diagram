import { memo } from 'react';
import { Position, getStepPath } from 'cosmos-diagram';

import BaseEdge from './BaseEdge';

import { Edge, EdgeProps } from './type';

interface StepPathOptions {
   offset?: number;
   borderRadius?: number;
}

interface StepEdgeProps<EdgeType extends Edge = Edge>
   extends EdgeProps<EdgeType> {
   pathOptions?: StepPathOptions;
}

const StepEdge = memo(
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
      sourcePosition = Position.Bottom,
      targetPosition = Position.Top,
      markerEnd,
      markerStart,
      pathOptions,
   }: StepEdgeProps) => {
      const [path, labelX, labelY] = getStepPath({
         sourceX,
         sourceY,
         sourcePosition,
         targetX,
         targetY,
         targetPosition,
         borderRadius: pathOptions?.borderRadius,
         offset: pathOptions?.offset,
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

StepEdge.displayName = 'StepEdge';

export default StepEdge;
