import {
   MouseEvent as ReactMouseEvent,
   TouchEvent as ReactTouchEvent,
} from 'react';

import { ErrorMessageCode, PortType } from '@diagram/core';

export type OnError = (id: ErrorMessageCode, message?: string) => void;

export type Viewport = {
   x: number;
   y: number;
   zoom: number;
};

export interface Connection {
   source: string | null;
   target: string | null;
}

export type OnConnect = (connection: Connection) => void;
export type OnConnectStartParams = {
   nodeId: string | null;
   portType: PortType | null;
};

export type OnConnectStart = (
   event: ReactMouseEvent | ReactTouchEvent,
   params: OnConnectStartParams,
) => void;

export type OnConnectEnd = (event: MouseEvent | TouchEvent) => void;

export type OnMove = (
   event: MouseEvent | TouchEvent,
   viewport: Viewport,
) => void;
