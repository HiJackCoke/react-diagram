import { D3DragEvent, SubjectPosition } from 'd3-drag';
import { XYPosition } from 'react-cosmos-diagram';

export type PanBy = (delta: XYPosition) => void;

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
