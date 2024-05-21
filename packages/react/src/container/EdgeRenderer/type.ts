import { ComponentType } from 'react';

import { EdgeProps } from '../../components/Edges/type';
import { EdgeWrapperComponent } from '../../components/Edges/EdgeWrapper/type';

export type EdgeTypes = { [key: string]: ComponentType<EdgeProps> };

export type EdgeTypesWrapped = {
   [key: string]: EdgeWrapperComponent;
};
