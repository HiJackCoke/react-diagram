import { XYPosition, Position, Dimensions } from '.';

export interface PortElement extends XYPosition, Dimensions {
   id?: string | null;
   position: Position;
}
