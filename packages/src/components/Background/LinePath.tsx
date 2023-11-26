type LinePathProps = {
   scaledGap: [number, number];
   lineWidth?: number;
   color: string;
};

function LinePath({ color, scaledGap, lineWidth }: LinePathProps) {
   const m1 = `M${scaledGap[0] / 2} 0`;
   const v = `V${scaledGap[1]}`;
   const m2 = `M0 ${scaledGap[1] / 2}`;
   const h = `H${scaledGap[0]}`;
   const path = `${m1} ${v} ${m2} ${h}`;

   return <path stroke={color} strokeWidth={lineWidth} d={path} />;
}

export default LinePath;
