import { useMemo, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { devWarn } from 'cosmos-diagram';

import { EdgeTypes, EdgeTypesWrapped } from '../container/EdgeRenderer/type';
import { NodeTypes, NodeTypesWrapped } from '../container/NodeRenderer/type';
import { Edge, Node } from '../types';

export type CreateNodeTypes<NodeType extends Node = Node> = (
   nodeTypes: NodeTypes<NodeType>,
) => NodeTypesWrapped<NodeType>;
export type CreateEdgeTypes<EdgeType extends Edge = Edge> = (
   edgeTypes: EdgeTypes<EdgeType>,
) => EdgeTypesWrapped<EdgeType>;

export function useNodeOrEdgeTypes<NodeType extends Node = Node>(
   nodeOrEdgeTypes: NodeTypes<NodeType>,
   createTypes: CreateNodeTypes<NodeType>,
): NodeTypesWrapped<NodeType>;
export function useNodeOrEdgeTypes<EdgeType extends Edge = Edge>(
   nodeOrEdgeTypes: EdgeTypes<EdgeType>,
   createTypes: CreateEdgeTypes<EdgeType>,
): EdgeTypesWrapped<EdgeType>;

export function useNodeOrEdgeTypes(
   nodeOrEdgeTypes: any,
   createTypes: any,
): any {
   const typesKeysRef = useRef<string[] | null>(null);

   const typesParsed = useMemo(() => {
      if (process.env.NODE_ENV === 'development') {
         const typeKeys = Object.keys(nodeOrEdgeTypes);
         if (shallow(typesKeysRef.current, typeKeys)) {
            devWarn('002');
         }

         typesKeysRef.current = typeKeys;
      }
      return createTypes(nodeOrEdgeTypes);
   }, [nodeOrEdgeTypes]);

   return typesParsed;
}
