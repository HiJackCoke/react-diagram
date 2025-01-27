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
