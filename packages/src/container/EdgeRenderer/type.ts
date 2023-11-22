import { ComponentType, MemoExoticComponent } from 'react';

import { EdgeProps } from '../../components/Edges/type';
import { WrapEdgeProps } from '../../components/Edges/EdgeWrapper/type';

export type EdgeTypes = { [key: string]: ComponentType<EdgeProps> };
export type EdgeComponent = MemoExoticComponent<ComponentType<WrapEdgeProps>>;
export type EdgeTypesWrapped = {
   [key: string]: MemoExoticComponent<ComponentType<WrapEdgeProps>>;
};
