import { MouseEvent } from 'react';

import { Node } from '../type';
import { CoordinateExtent, NodeOrigin } from 'cosmos-diagram';
import { ReactDiagramStore } from '../../ReactDiagramProvider/type';

export type NodeMouseHandler<NodeType extends Node = Node> = (
   event: MouseEvent,
   node: NodeType,
) => void;

export type NodeWrapperProps<
   NodeType extends Node = Node,
   // NodeData extends Record<string, unknown> = Record<string, unknown>,
> = Pick<
   NodeType,
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
   | 'selectable'
   | 'draggable'
> &
   Pick<
      ReactDiagramStore<NodeType>,
      'rfId' | 'elementsSelectable' | 'nodesDraggable'
   > &
   Required<Pick<NodeType, 'type' | 'zIndex'>> & {
      positionX: number;
      positionY: number;

      initialized: boolean;

      // isSelectable: boolean;
      // isDraggable: boolean;

      onClick?: NodeMouseHandler<NodeType>;
      onDoubleClick?: NodeMouseHandler<NodeType>;
      onMouseEnter?: NodeMouseHandler<NodeType>;
      onMouseMove?: NodeMouseHandler<NodeType>;
      onMouseLeave?: NodeMouseHandler<NodeType>;
      onContextMenu?: NodeMouseHandler<NodeType>;
      resizeObserver: ResizeObserver | null;
      isParent: boolean;

      disableKeyboardA11y: boolean;
      noDragClassName: string;
      noPanClassName: string;
      nodeOrigin: NodeOrigin;
      nodeExtent: CoordinateExtent;
   };
