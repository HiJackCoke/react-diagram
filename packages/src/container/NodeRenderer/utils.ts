import type { ComponentType } from 'react';

import wrapNode from '../../components/Node/wrapNode';
import Node from '../../components/Node';

import { NodeProps } from '../../components/Node/type';
import { NodeTypes, NodeTypesWrapped } from './type';

export function createNodeTypes(nodeTypes: NodeTypes): NodeTypesWrapped {
   const defaultType: NodeTypesWrapped = {
      default: wrapNode(
         (nodeTypes.default || Node) as ComponentType<NodeProps>,
      ),
   };

   const wrappedTypes = {} as NodeTypesWrapped;
   const customTypes: NodeTypesWrapped = Object.keys(nodeTypes)
      .filter((key) => key !== 'default')
      .reduce((res, key) => {
         res[key] = wrapNode(
            (nodeTypes[key] || Node) as ComponentType<NodeProps>,
         );

         return res;
      }, wrappedTypes);

   return {
      ...defaultType,
      ...customTypes,
   };
}
