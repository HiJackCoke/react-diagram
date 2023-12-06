import { MouseEvent as ReactMouseEvent } from 'react';
import { D3DragEvent, SubjectPosition } from 'd3';

import { XYPosition } from '../../types';
import { Node } from '../../types';

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

export type NodeDragItem = Pick<
   Node,
   | 'id'
   | 'position'
   | 'positionAbsolute'
   | 'width'
   | 'height'
   | 'extent'
   | 'parentNode'
   | 'dragging'
> & {
   distance: XYPosition;
};

export type NodeDragHandler = (
   event: ReactMouseEvent,
   node: Node,
   nodes: Node[],
) => void;
