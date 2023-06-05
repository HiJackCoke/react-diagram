import { useMemo, useRef } from 'react';
import { shallow } from 'zustand/shallow';

import { devWarn } from 'utils';
import {
   EdgeTypes,
   EdgeTypesWrapped,
   CreateEdgeTypes,
} from 'container/EdgeRenderer/type';
import {
   NodeTypes,
   NodeTypesWrapped,
   CreateNodeTypes,
} from 'container/NodeRenderer/type';

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
            devWarn(
               '002',
               // eslint-disable-next-line quotes
               "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
            );
         }

         typesKeysRef.current = typeKeys;
      }
      return createTypes(nodeOrEdgeTypes);
   }, [nodeOrEdgeTypes]);

   return typesParsed;
}
