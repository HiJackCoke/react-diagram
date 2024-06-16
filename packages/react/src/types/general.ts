import { ErrorMessageCode } from '@diagram/core';

export type OnError = (id: ErrorMessageCode, message?: string) => void;

export type Viewport = {
   x: number;
   y: number;
   zoom: number;
};

export type OnMove = (
   event: MouseEvent | TouchEvent,
   viewport: Viewport,
) => void;
