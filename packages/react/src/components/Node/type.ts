import { Position, CoreNode } from '@diagram/core';

import { NodeWrapperProps } from './NodeWrapper/type';
import { CSSProperties } from 'react';

export type Node<
   NodeData extends Record<string, unknown> = Record<string, unknown>,
   NodeType extends string = string,
> = CoreNode<NodeData, NodeType> & {
   style?: CSSProperties;
   className?: string;
};

export type NodeProps<
   NodeData extends Record<string, unknown> = Record<string, unknown>,
> = Pick<
   NodeWrapperProps<NodeData>,
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
