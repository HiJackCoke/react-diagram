import { Dimensions, Position, XYPosition } from './utils';

export interface PortElement extends XYPosition, Dimensions {
   id?: string | null;
   position: Position;
}

export type PortType = 'source' | 'target';

export interface PortProps {
   id?: string;
   type: PortType;
   position: Position;
}

export interface Connection {
   source: string | null;
   target: string | null;
}

type OnConnectStartParams = {
   nodeId: string | null;
   portType: PortType | null;
};

export type OnConnectStart = (
   event: MouseEvent | TouchEvent,
   params: OnConnectStartParams,
) => void;

export type OnConnect = (connection: Connection) => void;

export type OnConnectEnd = (event: MouseEvent | TouchEvent) => void;

export type UpdateConnection = (params: {
   connectionPosition: XYPosition | null;
   connectionNodeId?: string | null;
   connectionPortType?: PortType | null;
}) => void;

export type ConnectionPort = {
   // id: string | null;
   type: PortType;
   nodeId: string;
   x: number;
   y: number;
};
