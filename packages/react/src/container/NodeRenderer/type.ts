import { ComponentType, MemoExoticComponent } from 'react';

import { NodeProps } from '../../components/Node/type';
import { NodeWrapperProps } from '../../components/Node/NodeWrapper/type';

export type NodeTypes = Record<
   string,
   ComponentType<
      NodeProps & {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         data: any;
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         type: any;
      }
   >
>;
export type NodeTypesWrapped = Record<
   string,
   MemoExoticComponent<ComponentType<NodeWrapperProps>>
>;
