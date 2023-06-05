import { ComponentType, MemoExoticComponent } from 'react';

import { WrapNodeProps, NodeProps } from 'components/Node/type';

export type NodeTypes = { [key: string]: ComponentType<NodeProps> };
export type NodeTypesWrapped = {
   [key: string]: MemoExoticComponent<ComponentType<WrapNodeProps>>;
};
