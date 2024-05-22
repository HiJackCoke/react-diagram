import type { XYPosition, Position, Dimensions } from '@diagram/core';

export type PortType = 'source' | 'target';

export interface PortElement extends XYPosition, Dimensions {
   id?: string | null;
   position: Position;
}

export interface PortProps {
   id?: string;
   type: PortType;
   position: Position;
}

export type PortBounds = {
   source: PortElement[] | null;
   target: PortElement[] | null;
};

export type ConnectionPort = {
   // id: string | null;
   type: PortType;
   nodeId: string;
   x: number;
   y: number;
};
