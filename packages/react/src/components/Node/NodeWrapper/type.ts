import { MouseEvent } from 'react';

import { Node } from '../type';

export type NodeMouseHandler = (event: MouseEvent, node: Node) => void;

export type NodeWrapperProps<
   NodeData extends Record<string, unknown> = Record<string, unknown>,
> = Pick<
   Node<NodeData>,
   | 'id'
   | 'data'
   | 'style'
   | 'className'
   | 'selected'
   | 'intersected'
   | 'dragHandle'
   | 'sourcePosition'
   | 'targetPosition'
   | 'hidden'
   | 'ariaLabel'
   | 'width'
   | 'height'
> &
   Required<Pick<Node<NodeData>, 'type' | 'zIndex'>> & {
      positionX: number;
      positionY: number;

      initialized: boolean;
      isSelectable: boolean;
      isDraggable: boolean;

      onClick?: NodeMouseHandler;
      onDoubleClick?: NodeMouseHandler;
      onMouseEnter?: NodeMouseHandler;
      onMouseMove?: NodeMouseHandler;
      onMouseLeave?: NodeMouseHandler;
      onContextMenu?: NodeMouseHandler;
      resizeObserver: ResizeObserver | null;
      isParent: boolean;
      rfId: string;
      disableKeyboardA11y: boolean;
      noDragClassName: string;
      noPanClassName: string;
   };
