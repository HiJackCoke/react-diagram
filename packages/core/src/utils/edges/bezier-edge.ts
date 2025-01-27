import { Position } from '../../types';

export type GetBezierPathParams = {
   sourceX: number;
   sourceY: number;
   sourcePosition?: Position;
   targetX: number;
   targetY: number;
   targetPosition?: Position;
   curvature?: number;
};

export type GetControlWithCurvatureParams = {
   pos: Position;
   x1: number;
   y1: number;
   x2: number;
   y2: number;
   c: number;
};

export const getBezierEdgeCenter = ({
   sourceX,
   sourceY,
   targetX,
   targetY,
   sourceControlX,
   sourceControlY,
   targetControlX,
   targetControlY,
}: {
   sourceX: number;
   sourceY: number;
   targetX: number;
   targetY: number;
   sourceControlX: number;
   sourceControlY: number;
   targetControlX: number;
   targetControlY: number;
}): [number, number, number, number] => {
   // cubic bezier t=0.5 mid point, not the actual mid point, but easy to calculate
   // https://stackoverflow.com/questions/67516101/how-to-find-distance-mid-point-of-bezier-curve

   const midPoint = 0.5;
   const point = 0.125;
   const controlPoint = midPoint - point;

   const centerX =
      sourceX * point +
      sourceControlX * controlPoint +
      targetControlX * controlPoint +
      targetX * point;
   const centerY =
      sourceY * point +
      sourceControlY * controlPoint +
      targetControlY * controlPoint +
      targetY * point;

   const offsetX = Math.abs(centerX - sourceX);
   const offsetY = Math.abs(centerY - sourceY);

   return [centerX, centerY, offsetX, offsetY];
};

const calculateControlOffset = (
   distance: number,
   curvature: number,
): number => {
   if (distance >= 0) {
      return 0.5 * distance;
   }

   return curvature * 25 * Math.sqrt(-distance);
};

const getControlWithCurvature = ({
   pos,
   x1,
   y1,
   x2,
   y2,
   c,
}: GetControlWithCurvatureParams): [number, number] => {
   switch (pos) {
      case Position.Left:
         return [x1 - calculateControlOffset(x1 - x2, c), y1];
      case Position.Right:
         return [x1 + calculateControlOffset(x2 - x1, c), y1];
      case Position.Top:
         return [x1, y1 - calculateControlOffset(y1 - y2, c)];
      case Position.Bottom:
         return [x1, y1 + calculateControlOffset(y2 - y1, c)];
   }
};

/**
 * Get a bezier path from source to target port
 * @param params.sourceX - The x position of the source port
 * @param params.sourceY - The y position of the source port
 * @param params.sourcePosition - The position of the source port (default: Position.Bottom)
 * @param params.targetX - The x position of the target port
 * @param params.targetY - The y position of the target port
 * @param params.targetPosition - The position of the target port (default: Position.Top)
 * @param params.curvature - The curvature of the bezier edge
 * @returns A path string you can use in an SVG, the labelX and labelY position (center of path) and offsetX, offsetY between source port and label
 * @example
 *  const source = { x: 0, y: 20 };
    const target = { x: 150, y: 100 };
    
    const [path, labelX, labelY, offsetX, offsetY] = getBezierPath({
      sourceX: source.x,
      sourceY: source.y,
      sourcePosition: Position.Right,
      targetX: target.x,
      targetY: target.y,
      targetPosition: Position.Left,
});
 */

export const getBezierPath = ({
   sourceX,
   sourceY,
   sourcePosition = Position.Bottom,
   targetX,
   targetY,
   targetPosition = Position.Top,
   curvature = 0.25,
}: GetBezierPathParams): [
   path: string,
   labelX: number,
   labelY: number,
   offsetX: number,
   offsetY: number,
] => {
   const [sourceControlX, sourceControlY] = getControlWithCurvature({
      pos: sourcePosition,
      x1: sourceX,
      y1: sourceY,
      x2: targetX,
      y2: targetY,
      c: curvature,
   });
   const [targetControlX, targetControlY] = getControlWithCurvature({
      pos: targetPosition,
      x1: targetX,
      y1: targetY,
      x2: sourceX,
      y2: sourceY,
      c: curvature,
   });
   const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourceControlX,
      sourceControlY,
      targetControlX,
      targetControlY,
   });

   return [
      `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
      labelX,
      labelY,
      offsetX,
      offsetY,
   ];
};
