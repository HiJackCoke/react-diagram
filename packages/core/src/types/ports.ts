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
   sourcePort: string | null;
   targetPort: string | null;
}

export type ConnectingPort = {
   nodeId: string | null;
   portId: string | null;
   portType: PortType | null;
};

export type OnConnectStart = (
   event: MouseEvent | TouchEvent,
   params: ConnectingPort,
) => void;

export type OnConnect = (connection: Connection) => void;

export type OnConnectEnd = (event: MouseEvent | TouchEvent) => void;

export type UpdateConnection = (params: {
   connectionPosition: XYPosition | null;
   connectionStartPort: ConnectingPort | null;
   connectionEndPort: ConnectingPort | null;
}) => void;

export type ConnectionPort = ConnectingPort & XYPosition;
