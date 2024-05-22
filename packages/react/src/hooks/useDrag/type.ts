import { MouseEvent as ReactMouseEvent } from 'react';
import { D3DragEvent, SubjectPosition } from 'd3';

import { XYPosition } from '@diagram/core';
import { Node } from '../../types';

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

export type FilteredNode = Required<
   Pick<Node, 'id' | 'position' | 'positionAbsolute' | 'width' | 'height'>
> &
   Pick<Node, 'extent' | 'parentNode' | 'dragging'>;

export type NodeDragItem = FilteredNode & {
   distance: XYPosition;
};

export type NodeDragHandler = (
   event: ReactMouseEvent,
   node: Node,
   nodes: Node[],
) => void;
