import type { ComponentType } from 'react';

import wrapNode from '../../components/Node/wrapNode';
import Nodes from '../../components/Node';

import { NodeProps } from '../../components/Node/type';
import { NodeTypes, NodeTypesWrapped } from './type';

export function createNodeTypes(nodeTypes: NodeTypes): NodeTypesWrapped {
   const standardTypes: NodeTypesWrapped = {
      default: wrapNode(
         (nodeTypes.default || Nodes) as ComponentType<NodeProps>,
      ),
   };

   return standardTypes;
}
