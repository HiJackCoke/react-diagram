import {
   MouseEvent as ReactMouseEvent,
   TouchEvent as ReactTouchEvent,
} from 'react';

import { StoreApi } from 'zustand';

import { getEventPosition } from 'utils';

import { ReactDiagramState } from 'types';

export const getHostForElement = (
   element: HTMLElement,
): Document | ShadowRoot =>
   (element.getRootNode?.() as Document | ShadowRoot) || window?.document;

export function handlePointerDown({
   event,
   nodeId,

   getState,
   setState,
}: {
   event: ReactMouseEvent | ReactTouchEvent;
   nodeId: string;

   getState: StoreApi<ReactDiagramState>['getState'];
   setState: StoreApi<ReactDiagramState>['setState'];
}): void {
   const doc = getHostForElement(event.target as HTMLElement);
   const { domNode } = getState();

   const containerBounds = domNode?.getBoundingClientRect();

   let connectionPosition = getEventPosition(event, containerBounds);

   setState({
      connectionPosition,
      connectionNodeId: nodeId,
   });

   function onPointerMove(event: MouseEvent | TouchEvent) {
      connectionPosition = getEventPosition(event, containerBounds);
      setState({
         connectionPosition: connectionPosition,
      });
   }

   function onPointerUp() {
      doc.removeEventListener('mousemove', onPointerMove as EventListener);
      doc.removeEventListener('mouseup', onPointerUp as EventListener);
   }

   doc.addEventListener('mousemove', onPointerMove as EventListener);
   doc.addEventListener('mouseup', onPointerUp as EventListener);
}
