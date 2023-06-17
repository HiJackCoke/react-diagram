import { RefObject } from 'react';
import { D3DragEvent, SubjectPosition } from 'd3';

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

export type UseDragParams = {
   nodeRef: RefObject<Element>;
   nodeId?: string;
   isSelectable?: boolean;
};
