import { PortElement } from './ports';
import { CoordinateExtent, Position, XYPosition } from './utils';

// export const internalsSymbol = Symbol.for('internals');
export const internalsSymbol = 'internals';

export type NodeInternals<Node = CoreNode> = Map<string, Node>;

export type InternalCoreNode = {
   z?: number;
   portBounds?: NodePortBounds;
   isParent?: boolean;
};

export type CoreNode<
   NodeData extends Record<string, unknown> = Record<string, unknown>,
   NodeType extends string = string,
> = {
   id: string;
   data: NodeData;
   type?: NodeType;
   sourcePosition?: Position;
   targetPosition?: Position;
   hidden?: boolean;
   selected?: boolean;
   intersected?: boolean;
   dragging?: boolean;
   draggable?: boolean;
   selectable?: boolean;
   connectable?: boolean;
   deletable?: boolean;
   dragHandle?: string;
   width?: number;
   height?: number;
   parentNode?: string;
   zIndex?: number;
   extent?: CoordinateExtent;
   expandParent?: boolean;
   position: XYPosition;
   positionAbsolute?: XYPosition;
   ariaLabel?: string;
   focusable?: boolean;
   resizing?: boolean;
   [internalsSymbol]?: InternalCoreNode;
};

export type NodeOrigin = [number, number];

export type NodePortBounds = {
   source: PortElement[] | null;
   target: PortElement[] | null;
};

export type NodeDragItem = Required<
   Pick<CoreNode, 'id' | 'position' | 'positionAbsolute' | 'width' | 'height'>
> &
   Pick<CoreNode, 'extent' | 'parentNode' | 'dragging'> & {
      distance: XYPosition;
   };
