import { XYPosition, Transform } from './utils';

type StepPositionParams = {
   position: XYPosition;
   nodeSize?: {
      width: number;
      height: number;
   };
};

export type GridStep = [number, number];

export type GetStepPosition = (params?: StepPositionParams) => XYPosition;

export type PointerPosition = XYPosition & {
   getStepPosition?: GetStepPosition;
};

export type GetPointerPositionParams = {
   transform: Transform;
   gridStep?: GridStep;
   centerStep?: boolean;
};
