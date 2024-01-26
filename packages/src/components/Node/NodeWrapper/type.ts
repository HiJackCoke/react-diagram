import { MouseEvent } from 'react';

import { Node } from '../type';

export type NodeMouseHandler = (event: MouseEvent, node: Node) => void;

export type WrapNodeProps<T = any> = Pick<
   Node<T>,
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
   Required<Pick<Node<T>, 'type' | 'zIndex'>> & {
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
