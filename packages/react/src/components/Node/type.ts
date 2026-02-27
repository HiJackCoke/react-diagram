import { Position, CoreNode } from 'cosmos-diagram';

import { NodeWrapperProps } from './NodeWrapper/type';
import { CSSProperties } from 'react';

export type Node<
   NodeData extends Record<string, unknown> = Record<string, unknown>,
   NodeType extends string = string,
> = CoreNode<NodeData, NodeType> & {
   style?: CSSProperties;
   className?: string;
};

export type NodeProps<NodeType extends Node = Node> = Pick<
   NodeWrapperProps<NodeType>,
   | 'id'
   | 'data'
   | 'dragHandle'
   | 'type'
   | 'selected'
   | 'intersected'
   | 'positionX'
   | 'positionY'
   | 'zIndex'
   | 'width'
   | 'height'
> & {
   targetPosition?: Position;
   sourcePosition?: Position;
};
