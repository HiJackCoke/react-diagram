import { MouseEvent as ReactMouseEvent } from 'react';
import { D3DragEvent, SubjectPosition } from 'd3';

import { XYPosition, CoordinateExtent } from '../../types';
import { Node } from '../../types';

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

export type NodeDragItem = {
   id: string;
   position: XYPosition;
   positionAbsolute: XYPosition;
   // distance from the mouse cursor to the node when start dragging
   distance: XYPosition;
   width?: number | null;
   height?: number | null;
   extent?: 'parent' | CoordinateExtent;
   parentNode?: string;
   dragging?: boolean;
};

export type NodeDragHandler = (
   event: ReactMouseEvent,
   node: Node,
   nodes: Node[],
) => void;
