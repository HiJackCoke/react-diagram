import { D3DragEvent, SubjectPosition } from 'd3-drag';
import { Selection as D3Selection } from 'd3-selection';
import { XYPosition } from './utils';
;

export type PanBy = (delta: XYPosition) => void;

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

export type Viewport = {
   x: number;
   y: number;
   zoom: number;
};

export type D3SelectionInstance = D3Selection<
   Element,
   unknown,
   null,
   undefined
>;
export type D3ZoomHandler = (this: Element, event: any, d: unknown) => void;
