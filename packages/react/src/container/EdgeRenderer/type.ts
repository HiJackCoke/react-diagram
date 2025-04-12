import { ComponentType } from 'react';

import { EdgeProps } from '../../components/Edges/type';
import { EdgeWrapperProps } from '../../components/Edges/EdgeWrapper/type';

export type EdgeTypes = Record<string, ComponentType<EdgeProps>>;

export type EdgeTypesWrapped = Record<string, EdgeWrapperProps>;
