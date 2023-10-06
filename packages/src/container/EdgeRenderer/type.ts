import { ComponentType, MemoExoticComponent } from 'react';

import { WrapEdgeProps, EdgeProps } from '../../components/Edges/type';

export type EdgeTypes = { [key: string]: ComponentType<EdgeProps> };
export type EdgeTypesWrapped = {
   [key: string]: MemoExoticComponent<ComponentType<WrapEdgeProps>>;
};
