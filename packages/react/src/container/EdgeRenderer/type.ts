import { ComponentType } from 'react';

import { Edge, EdgeProps } from '../../components/Edges/type';
import { EdgeWrapperProps } from '../../components/Edges/EdgeWrapper/type';

export type EdgeTypes<EdgeType extends Edge = Edge> = Record<
   string,
   ComponentType<
      EdgeProps<EdgeType> & {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         data?: any;
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         type: any;
      }
   >
>;

export type EdgeTypesWrapped<EdgeType extends Edge = Edge> = Record<
   string,
   EdgeWrapperProps<EdgeType>
>;
