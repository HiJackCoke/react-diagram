import React from 'react';
import { Dimensions, Position } from '../types';
import { NodeOrigin } from '../types/nodes';
import { PortElement } from '../types/ports';

export const getDimensions = (node: HTMLDivElement): Dimensions => ({
   width: node.offsetWidth,
   height: node.offsetHeight,
});

export const getPortBounds = (
   selector: string,
   nodeElement: HTMLDivElement,
   zoom: number,
   nodeOrigin: NodeOrigin,
): PortElement[] | null => {
   const ports = nodeElement.querySelectorAll(selector);

   if (!ports || !ports.length) {
      return null;
   }

   const portsArray = Array.from(ports) as HTMLDivElement[];
   const nodeBounds = nodeElement.getBoundingClientRect();
   const nodeOffset = {
      x: nodeBounds.width * nodeOrigin[0],
      y: nodeBounds.height * nodeOrigin[1],
   };

   return portsArray.map((port): PortElement => {
      const portBounds = port.getBoundingClientRect();

      return {
         id: port.getAttribute('data-portid'),
         position: port.dataset.portPosition as unknown as Position,
         x: (portBounds.left - nodeBounds.left - nodeOffset.x) / zoom,
         y: (portBounds.top - nodeBounds.top - nodeOffset.y) / zoom,
         ...getDimensions(port),
      };
   });
};

export const getHostForElement = (
   element: HTMLElement,
): Document | ShadowRoot =>
   (element.getRootNode?.() as Document | ShadowRoot) || window?.document;

// 추후에 React 마우스 이벤트 제거
export const isMouseEvent = (
   event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
): event is MouseEvent | React.MouseEvent => 'clientX' in event;

// 추후에 React 마우스 이벤트 제거
export const getEventPosition = (
   event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
   bounds?: DOMRect,
) => {
   const isMouseTriggered = isMouseEvent(event);
   const eventX = isMouseTriggered ? event.clientX : event.touches?.[0].clientX;
   const eventY = isMouseTriggered ? event.clientY : event.touches?.[0].clientY;

   return {
      x: eventX - (bounds?.left ?? 0),
      y: eventY - (bounds?.top ?? 0),
   };
};
