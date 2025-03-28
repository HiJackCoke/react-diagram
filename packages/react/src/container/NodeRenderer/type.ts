import { ComponentType, MemoExoticComponent } from 'react';

import { NodeProps } from '../../components/Node/type';
import { NodeWrapperProps } from '../../components/Node/NodeWrapper/type';

export type NodeTypes = { [key: string]: ComponentType<NodeProps> };
export type NodeTypesWrapped = {
   [key: string]: MemoExoticComponent<ComponentType<NodeWrapperProps>>;
};
