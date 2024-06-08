import { useCallback } from 'react';

import { Transform, XYPosition, getPointerPosition } from '@diagram/core';

import { GridStep } from '@diagram/core';

type NodeSize = {
   width: number;
   height: number;
};

type StepPositionParams = {
   position: XYPosition;
   nodeSize?: NodeSize;
};

type GetStepPosition = (params?: StepPositionParams) => XYPosition;

export type PointerPosition = XYPosition & {
   getStepPosition?: GetStepPosition;
};

export type GetPointerPositionParams = {
   transform: Transform;
   gridStep?: GridStep;
   centerStep?: boolean;
};

const useGetPointerPosition = () => {
   return useCallback(getPointerPosition, []);
};

export default useGetPointerPosition;
