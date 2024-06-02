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

export type ConnectionPort = {
   // id: string | null;
   type: PortType;
   nodeId: string;
   x: number;
   y: number;
};
