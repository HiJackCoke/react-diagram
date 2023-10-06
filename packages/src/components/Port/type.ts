import type { XYPosition, Position, Dimensions } from '../../types';

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
