import {
   MouseEvent as ReactMouseEvent,
   TouchEvent as ReactTouchEvent,
} from 'react';
import { PortType } from 'components/Port/type';

export type OnError = (id: string, message: string) => void;

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

export type GridStep = [number, number];
