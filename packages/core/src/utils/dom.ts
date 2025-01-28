import {
   Dimensions,
   GetPointerPositionParams,
   GetStepPosition,
   Position,
   Transform,
   XYPosition,
} from '../types';
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

export const isMouseEvent = (
   event: MouseEvent | TouchEvent,
): event is MouseEvent => 'clientX' in event;

export const getEventPosition = (
   event: MouseEvent | TouchEvent,
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

export const pointToRendererPoint = (
   { x, y }: XYPosition,
   [tx, ty, tScale]: Transform,
): XYPosition => {
   const position: XYPosition = {
      x: (x - tx) / tScale,
      y: (y - ty) / tScale,
   };

   return position;
};

export const rendererPointToPoint = (
   { x, y }: XYPosition,
   [tx, ty, tScale]: Transform,
): XYPosition => {
   return {
      x: x * tScale + tx,
      y: y * tScale + ty,
   };
};

export const getPointerPosition = (
   event: MouseEvent | TouchEvent,
   { transform, gridStep, centerStep }: GetPointerPositionParams,
) => {
   const { x, y } = getEventPosition(event);

   const pointerPos = pointToRendererPoint({ x, y }, transform);

   const getStepPosition: GetStepPosition = (
      params = {
         position: pointerPos,
      },
   ) => {
      const { position, nodeSize } = params;

      if (!gridStep) return position;

      let x = gridStep[0] * Math.round(position.x / gridStep[0]),
         y = gridStep[1] * Math.round(position.y / gridStep[1]);

      if (centerStep && nodeSize) {
         const centerX = (gridStep[0] - nodeSize.width) / 2;
         const centerY = (gridStep[1] - nodeSize.height) / 2;

         const positionX = position.x - centerX;
         const positionY = position.y - centerY;

         x = gridStep[0] * Math.round(positionX / gridStep[0]) + centerX;
         y = gridStep[1] * Math.round(positionY / gridStep[1]) + centerY;
      }

      return {
         x,
         y,
      };
   };

   return {
      getStepPosition,
      ...pointerPos,
   };
};
