import { MouseEvent as ReactMouseEvent } from 'react';
import { D3DragEvent, SubjectPosition } from 'd3';

import { Node } from '../../types';

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

export type NodeDragHandler = (
   event: ReactMouseEvent,
   node: Node,
   nodes: Node[],
) => void;
