export enum MarkerType {
   Arrow = 'arrow',
}

export type EdgeMarker = {
   type: MarkerType;
   color?: string;
   width?: number;
   height?: number;
   markerUnits?: string;
   orient?: string;
   strokeWidth?: number;
};
