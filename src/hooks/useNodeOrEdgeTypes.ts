import { useMemo, useRef } from 'react';
import { shallow } from 'zustand/shallow';

import { devWarn } from 'utils';
import { EdgeTypes, EdgeTypesWrapped } from 'container/EdgeRenderer/type';
import { NodeTypes, NodeTypesWrapped } from 'container/NodeRenderer/type';

import { errorMessages } from 'fixtures/errorMessages';

export type CreateNodeTypes = (nodeTypes: NodeTypes) => NodeTypesWrapped;
export type CreateEdgeTypes = (edgeTypes: EdgeTypes) => EdgeTypesWrapped;

export function useNodeOrEdgeTypes(
   nodeOrEdgeTypes: NodeTypes,
   createTypes: CreateNodeTypes,
): NodeTypesWrapped;
export function useNodeOrEdgeTypes(
   nodeOrEdgeTypes: EdgeTypes,
   createTypes: CreateEdgeTypes,
): EdgeTypesWrapped;

export function useNodeOrEdgeTypes(
   nodeOrEdgeTypes: any,
   createTypes: any,
): any {
   const typesKeysRef = useRef<string[] | null>(null);

   const typesParsed = useMemo(() => {
      if (process.env.NODE_ENV === 'development') {
         const typeKeys = Object.keys(nodeOrEdgeTypes);
         if (shallow(typesKeysRef.current, typeKeys)) {
            devWarn('002', errorMessages['002']());
         }

         typesKeysRef.current = typeKeys;
      }
      return createTypes(nodeOrEdgeTypes);
   }, [nodeOrEdgeTypes]);

   return typesParsed;
}
