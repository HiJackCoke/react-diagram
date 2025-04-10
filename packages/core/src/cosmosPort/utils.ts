import {
   ConnectingPort,
   Connection,
   ConnectionPort,
   CoreNode,
   NodePortBounds,
   PortType,
   XYPosition,
   internalsSymbol,
} from '../types';
import { getEventPosition } from '../utils';

type GetAllPortParams = {
   nodes: CoreNode[];
   nodeId: string;
   portId: string | null;
   portType: PortType;
};

type getConnectionResult = {
   isValid: boolean;
   connection: Connection | null;
   endPort: ConnectingPort | null;
};

const getPorts = (
   node: CoreNode,
   portBounds: NodePortBounds,
   type: PortType,
   currentPort: string,
): ConnectionPort[] =>
   (portBounds[type] || []).reduce<ConnectionPort[]>((res, h) => {
      if (`${node.id}-${h.id}-${type}` !== currentPort) {
         res.push({
            portId: h.id || null,
            portType: type,
            nodeId: node.id,
            x: (node.positionAbsolute?.x ?? 0) + h.x + h.width / 2,
            y: (node.positionAbsolute?.y ?? 0) + h.y + h.height / 2,
         });
      }
      return res;
   }, []);

export const getPortType = (PortDomNode: Element | null): PortType | null => {
   if (PortDomNode?.classList.contains('target')) {
      return 'target';
   } else if (PortDomNode?.classList.contains('source')) {
      return 'source';
   }

   return null;
};

export const getAllPort = ({
   nodes,
   nodeId,
   portId,
   portType,
}: GetAllPortParams) =>
   nodes.reduce<ConnectionPort[]>((res, node) => {
      if (node[internalsSymbol]) {
         const { portBounds } = node[internalsSymbol];
         let sourcePorts: ConnectionPort[] = [];
         let targetPorts: ConnectionPort[] = [];

         if (portBounds) {
            sourcePorts = getPorts(
               node,
               portBounds,
               'source',
               `${nodeId}-${portId}-${portType}`,
            );
            targetPorts = getPorts(
               node,
               portBounds,
               'target',
               `${nodeId}-${portId}-${portType}`,
            );
         }

         res.push(...sourcePorts, ...targetPorts);
      }
      return res;
   }, []);

export const getClosestPort = (
   pos: XYPosition,
   connectionRadius: number,
   ports: ConnectionPort[],
): ConnectionPort | null => {
   let closestPort: ConnectionPort | null = null;
   let minDistance = Infinity;

   ports.forEach((port) => {
      const distance = Math.sqrt(
         Math.pow(port.x - pos.x, 2) + Math.pow(port.y - pos.y, 2),
      );
      if (distance <= connectionRadius && distance < minDistance) {
         minDistance = distance;
         closestPort = port;
      }
   });

   return closestPort;
};

export const getConnection = (
   event: MouseEvent | TouchEvent,
   port: ConnectionPort | null,
   fromNodeId: string,
   fromPortId: string | null,
   fromType: PortType,
   doc: Document | ShadowRoot,
) => {
   const isTarget = fromType === 'target';

   const result: getConnectionResult = {
      isValid: false,
      connection: null,
      endPort: null,
   };

   const PortDomNode = doc.querySelector(
      `.react-diagram__port[data-id="${port?.nodeId}-${port?.portId}-${port?.portType}"]`,
   );

   const { x, y } = getEventPosition(event);
   const ElementFromPoint = doc.elementFromPoint(x, y);
   const Port = ElementFromPoint?.classList.contains('react-diagram__port')
      ? ElementFromPoint
      : PortDomNode;

   if (Port) {
      const portType = getPortType(Port);
      const toNodeId = Port.getAttribute('data-nodeid');
      const toPortId = Port.getAttribute('data-portid');

      const connection = {
         source: isTarget ? toNodeId : fromNodeId,
         target: isTarget ? fromNodeId : toNodeId,
         sourcePort: isTarget ? port?.portId || null : fromPortId,
         targetPort: isTarget ? fromPortId : port?.portId || null,
      };

      result.connection = connection;

      const isValid =
         (isTarget && portType === 'source') ||
         (!isTarget && portType === 'target');

      if (isValid) {
         result.isValid = true;
         result.endPort = {
            nodeId: toNodeId,
            portId: toPortId,
            portType,
         };
      }
   }

   return result;
};
