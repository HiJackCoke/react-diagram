import { MouseEvent, RefObject } from 'react';
import { StoreApi } from 'zustand';

import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';

import { Node } from './type';

export function getMouseHandler(
   id: string,
   getState: StoreApi<ReactDiagramState>['getState'],
   handler?: (event: MouseEvent, node: Node) => void,
) {
   return handler === undefined
      ? handler
      : (event: MouseEvent) => {
           const node = getState().nodeInternals.get(id)!;
           handler(event, { ...node });
        };
}

export function handleNodeClick({
   id,
   store,
   isSelectable,
   unselect = false,
   nodeRef,
}: {
   id: string;
   store: {
      getState: StoreApi<ReactDiagramState>['getState'];
      setState: StoreApi<ReactDiagramState>['setState'];
   };
   isSelectable?: boolean;
   unselect?: boolean;
   nodeRef?: RefObject<HTMLDivElement>;
}) {
   if (!isSelectable) return;

   const {
      addSelectedNodes,
      unselectNodes,
      multiSelectionActive,
      nodeInternals,
   } = store.getState();
   const node = nodeInternals.get(id)!;

   store.setState({ selectionBoxActive: false });

   if (!node.selected) {
      addSelectedNodes([id]);
   } else if (unselect || (node.selected && multiSelectionActive)) {
      unselectNodes({ nodes: [node] });

      requestAnimationFrame(() => nodeRef?.current?.blur());
   }
}
