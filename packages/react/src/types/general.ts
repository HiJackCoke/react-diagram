import { ErrorMessageCode, Viewport } from '@diagram/core';

export type OnError = (id: ErrorMessageCode, message?: string) => void;

export type OnMove = (
   event: MouseEvent | TouchEvent,
   viewport: Viewport,
) => void;
