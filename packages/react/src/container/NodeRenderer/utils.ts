import wrapNode from '../../components/Node/NodeWrapper';
import Node from '../../components/Node';

import { NodeTypes, NodeTypesWrapped } from './type';

export const createNodeTypes = (nodeTypes: NodeTypes): NodeTypesWrapped => {
   const defaultTypes: NodeTypesWrapped = {
      default: wrapNode(nodeTypes.default || Node),
   };

   const wrappedTypes = {} as NodeTypesWrapped;
   const customTypes: NodeTypesWrapped = Object.keys(nodeTypes)
      .filter((k) => !Object.keys(defaultTypes).includes(k))
      .reduce((res, key) => {
         res[key] = wrapNode(nodeTypes[key] || Node);

         return res;
      }, wrappedTypes);

   return {
      ...defaultTypes,
      ...customTypes,
   };
};
