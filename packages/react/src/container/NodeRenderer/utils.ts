import wrapNode from '../../components/Node/NodeWrapper';
import NodeComponent from '../../components/Node';

import { NodeTypes, NodeTypesWrapped } from './type';
import { Node } from '../../types';
// import { Node } from '../../types';

export const createNodeTypes = <NodeType extends Node = Node>(
   nodeTypes: NodeTypes<NodeType>,
): NodeTypesWrapped<NodeType> => {
   const defaultTypes: NodeTypesWrapped<NodeType> = {
      default: wrapNode(nodeTypes.default || NodeComponent),
   };

   const wrappedTypes = {} as NodeTypesWrapped<NodeType>;
   const customTypes: NodeTypesWrapped<NodeType> = Object.keys(nodeTypes)
      .filter((k) => !Object.keys(defaultTypes).includes(k))
      .reduce((res, key) => {
         res[key] = wrapNode(nodeTypes[key] || NodeComponent);

         return res;
      }, wrappedTypes);

   return {
      ...defaultTypes,
      ...customTypes,
   };
};
