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
