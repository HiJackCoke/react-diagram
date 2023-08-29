import type {
   MouseEvent as ReactMouseEvent,
   TouchEvent as ReactTouchEvent,
} from 'react';
import { StoreApi } from 'zustand';

import { ReactDiagramState } from 'types';

export const isMouseEvent = (
   event: MouseEvent | ReactMouseEvent | TouchEvent | ReactTouchEvent,
): event is MouseEvent | ReactMouseEvent => 'clientX' in event;

export const getHostForElement = (
   element: HTMLElement,
): Document | ShadowRoot =>
   (element.getRootNode?.() as Document | ShadowRoot) || window?.document;

export const getEventPosition = (
   event: MouseEvent | ReactMouseEvent | TouchEvent | ReactTouchEvent,
   bounds?: DOMRect,
) => {
   const isMouseTriggered = isMouseEvent(event);
   const evtX = isMouseTriggered ? event.clientX : event.touches?.[0].clientX;
   const evtY = isMouseTriggered ? event.clientY : event.touches?.[0].clientY;

   return {
      x: evtX - (bounds?.left ?? 0),
      y: evtY - (bounds?.top ?? 0),
   };
};

export function handlePointerDown({
   event,
   getState,
}: {
   event: ReactMouseEvent | ReactTouchEvent;

   getState: StoreApi<ReactDiagramState>['getState'];
}): void {
   const doc = getHostForElement(event.target as HTMLElement);
   const { domNode } = getState();

   const containerBounds = domNode?.getBoundingClientRect();

   let connectionPosition = getEventPosition(event, containerBounds);

   function onPointerMove(event: MouseEvent | TouchEvent) {
      connectionPosition = getEventPosition(event, containerBounds);
      console.log(connectionPosition);
   }

   function onPointerUp() {
      doc.removeEventListener('mousemove', onPointerMove as EventListener);
      doc.removeEventListener('mouseup', onPointerUp as EventListener);
   }

   doc.addEventListener('mousemove', onPointerMove as EventListener);
   doc.addEventListener('mouseup', onPointerUp as EventListener);
}
