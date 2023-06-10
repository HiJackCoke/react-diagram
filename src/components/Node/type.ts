import { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

import { internalsSymbol } from 'utils';

import { PortElement, Position, XYPosition, CoordinateExtent } from 'types';

export type NodePortBounds = {
   source: PortElement[] | null;
   target: PortElement[] | null;
};

export type Node<T = any, U extends string | undefined = string | undefined> = {
   id: string;
   position: XYPosition;
   data: T;
   type?: U;
   style?: CSSProperties;
   className?: string;
   sourcePosition?: Position;
   targetPosition?: Position;
   hidden?: boolean;
   selected?: boolean;
   dragging?: boolean;
   draggable?: boolean;
   selectable?: boolean;
   connectable?: boolean;
   deletable?: boolean;
   dragHandle?: string;
   width?: number | null;
   height?: number | null;
   parentNode?: string;
   zIndex?: number;
   extent?: 'parent' | CoordinateExtent;
   expandParent?: boolean;
   positionAbsolute?: XYPosition;
   ariaLabel?: string;
   focusable?: boolean;
   resizing?: boolean;

   [internalsSymbol]?: {
      z?: number;
      handleBounds?: NodePortBounds;
      isParent?: boolean;
   };
};

export type NodeOrigin = [number, number];

export type NodeInternals = Map<string, Node>;

export type NodeDimensionUpdate = {
   id: string;
   nodeElement: HTMLDivElement;
   forceUpdate?: boolean;
};

// event
export type NodeMouseHandler = (event: ReactMouseEvent, node: Node) => void;

export type WrapNodeProps<T = any> = Pick<
   Node<T>,
   | 'id'
   | 'data'
   | 'style'
   | 'className'
   | 'selected'
   | 'dragHandle'
   | 'sourcePosition'
   | 'targetPosition'
   | 'hidden'
   | 'ariaLabel'
> &
   Required<Pick<Node<T>, 'type' | 'zIndex'>> & {
      xPos: number;
      yPos: number;
      xPosOrigin: number;
      yPosOrigin: number;
      initialized: boolean;

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
   };

export type NodeProps<T = any> = Pick<
   WrapNodeProps<T>,
   | 'id'
   | 'data'
   | 'dragHandle'
   | 'type'
   | 'selected'
   | 'xPos'
   | 'yPos'
   | 'zIndex'
> & {
   targetPosition?: Position;
   sourcePosition?: Position;
};

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
