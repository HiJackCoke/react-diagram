import { ComponentType, MemoExoticComponent } from 'react';

import { Node, NodeProps } from '../../components/Node/type';
import { NodeWrapperProps } from '../../components/Node/NodeWrapper/type';

export type NodeTypes<NodeType extends Node = Node> = Record<
   string,
   ComponentType<
      NodeProps<NodeType> & {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         data?: any;
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         type: any;
      }
   >
>;
export type NodeTypesWrapped<NodeType extends Node = Node> = Record<
   string,
   MemoExoticComponent<ComponentType<NodeWrapperProps<NodeType>>>
>;
