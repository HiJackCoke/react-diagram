import { ComponentType, MemoExoticComponent } from 'react';

import { EdgeProps } from '../../components/Edges/type';
import { WrapEdgeProps } from '../../components/Edges/wrapEdge';

export type EdgeTypes = { [key: string]: ComponentType<EdgeProps> };
export type EdgeTypesWrapped = {
   [key: string]: MemoExoticComponent<ComponentType<WrapEdgeProps>>;
};
