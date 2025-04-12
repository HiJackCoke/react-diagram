import { ComponentType } from 'react';

import { EdgeProps } from '../../components/Edges/type';
import { EdgeWrapperProps } from '../../components/Edges/EdgeWrapper/type';

export type EdgeTypes = Record<
   string,
   ComponentType<
      EdgeProps & {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         data: any;
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         type: any;
      }
   >
>;

export type EdgeTypesWrapped = Record<string, EdgeWrapperProps>;
