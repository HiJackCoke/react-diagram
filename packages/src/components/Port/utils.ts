import {
   MouseEvent as ReactMouseEvent,
   TouchEvent as ReactTouchEvent,
} from 'react';

import { StoreApi } from 'zustand';

import {
   calcAutoPanPosition,
   getEventPosition,
   internalsSymbol,
} from '../../utils';

import {
   Connection,
   Node,
   NodePortBounds,
   OnConnect,
   PortType,
   ReactDiagramState,
   XYPosition,
} from '../../types';

export type ConnectionPort = {
   // id: string | null;
   type: PortType;
   nodeId: string;
   x: number;
   y: number;
};

type getConnectionResult = {
   isValid: boolean;
   connection: Connection;
};

type GetAllPortParams = {
   nodes: Node[];
   nodeId: string;
   portType: string;
};

export const getHostForElement = (
   element: HTMLElement,
): Document | ShadowRoot =>
   (element.getRootNode?.() as Document | ShadowRoot) || window?.document;

const getPortType = (PortDomNode: Element | null): PortType | null => {
   if (PortDomNode?.classList.contains('target')) {
      return 'target';
   } else if (PortDomNode?.classList.contains('source')) {
      return 'source';
   }

   return null;
};

const getConnection = (
   event: MouseEvent | TouchEvent | ReactMouseEvent | ReactTouchEvent,
   port: Pick<ConnectionPort, 'nodeId' | 'type'> | null,
   fromNodeId: string,
   fromType: PortType,
   doc: Document | ShadowRoot,
) => {
   const isTarget = fromType === 'target';

   const result: getConnectionResult = {
      isValid: false,
      connection: {
         source: null,
         target: null,
      },
   };

   const PortDomNode = doc.querySelector(
      `.react-diagram__port[data-id="${port?.nodeId}-${port?.type}"]`,
   );

   const { x, y } = getEventPosition(event);
   const ElementFromPoint = doc.elementFromPoint(x, y);
   const Port = ElementFromPoint?.classList.contains('react-diagram__port')
      ? ElementFromPoint
      : PortDomNode;

   if (Port) {
      const portType = getPortType(Port);
      const toNodeId = Port.getAttribute('data-nodeid');

      const connection = {
         source: isTarget ? toNodeId : fromNodeId,
         target: isTarget ? fromNodeId : toNodeId,
      };

      result.connection = connection;

      const isValid =
         (isTarget && portType === 'source') ||
         (!isTarget && portType === 'target');

      if (isValid) {
         result.isValid = true;
      }
   }

   return result;
};

const getPorts = (
   node: Node,
   portBounds: NodePortBounds,
   type: PortType,
   currentPort: string,
): ConnectionPort[] =>
   (portBounds[type] || []).reduce<ConnectionPort[]>((res, h) => {
      if (`${node.id}-${type}` !== currentPort) {
         res.push({
            type,
            nodeId: node.id,
            x: (node.positionAbsolute?.x ?? 0) + h.x + h.width / 2,
            y: (node.positionAbsolute?.y ?? 0) + h.y + h.height / 2,
         });
      }
      return res;
   }, []);

const getAllPort = ({ nodes, nodeId, portType }: GetAllPortParams) =>
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
               `${nodeId}-${portType}`,
            );
            targetPorts = getPorts(
               node,
               portBounds,
               'target',
               `${nodeId}-${portType}`,
            );
         }

         res.push(...sourcePorts, ...targetPorts);
      }
      return res;
   }, []);

const getClosestPort = (
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

export const handlePointerDown = ({
   isAnchor = false,
   event,
   nodeId,
   portType,
   getState,
   setState,
   onConnect,
   onEdgeUpdateEnd,
}: {
   isAnchor?: boolean;
   event: ReactMouseEvent | ReactTouchEvent;
   nodeId: string;
   portType: PortType;
   getState: StoreApi<ReactDiagramState>['getState'];
   setState: StoreApi<ReactDiagramState>['setState'];
   onConnect: OnConnect;
   onEdgeUpdateEnd?: (evt: MouseEvent | TouchEvent) => void;
}): void => {
   const doc = getHostForElement(event.target as HTMLElement);

   const {
      domNode,
      autoPanOnConnect,
      getNodes,
      cancelConnection,
      onConnectStart,
      onConnectEnd,
      panBy,
   } = getState();

   const containerBounds = domNode?.getBoundingClientRect();

   const { x, y } = getEventPosition(event);
   const clickedPort = doc?.elementFromPoint(x, y);
   const clickedPortType = isAnchor ? portType : getPortType(clickedPort);
   const allPort = getAllPort({
      nodes: getNodes(),
      nodeId,
      portType,
   });

   let connectionPosition = getEventPosition(event, containerBounds);
   let closestPort: ConnectionPort | null = null;
   let isValid = false;
   let connection: Connection | null = null;
   let autoPanId = 0;
   let autoPanStarted = false;

   if (!containerBounds || !portType) {
      return;
   }

   const autoPan = (): void => {
      if (!autoPanOnConnect) {
         return;
      }

      const [xMovement, yMovement] = calcAutoPanPosition(
         connectionPosition,
         containerBounds,
      );

      panBy({ x: xMovement, y: yMovement });
      autoPanId = requestAnimationFrame(autoPan);
   };

   setState({
      connectionPosition,
      connectionNodeId: nodeId,
      connectionPortType: clickedPortType,
   });

   onConnectStart?.(event, { nodeId, portType });

   const onPointerMove = (event: MouseEvent | TouchEvent) => {
      connectionPosition = getEventPosition(event, containerBounds);

      closestPort = getClosestPort(connectionPosition, 20, allPort);

      if (!autoPanStarted) {
         autoPan();
         autoPanStarted = true;
      }

      const result = getConnection(event, closestPort, nodeId, portType, doc);

      isValid = result.isValid;
      connection = result.connection;

      if (closestPort && isValid) {
         const { x, y } = closestPort;
         setState({
            connectionPosition: {
               x,
               y,
            },
         });
      } else {
         setState({
            connectionPosition,
         });
      }
   };

   const onPointerUp = (event: MouseEvent | TouchEvent) => {
      if (isValid && connection) onConnect?.(connection);

      onConnectEnd?.(event);

      if (portType) {
         onEdgeUpdateEnd?.(event);
      }

      cancelConnection();
      cancelAnimationFrame(autoPanId);

      isValid = false;
      connection = null;
      autoPanStarted = false;

      doc.removeEventListener('mousemove', onPointerMove as EventListener);
      doc.removeEventListener('mouseup', onPointerUp as EventListener);

      doc.removeEventListener('touchmove', onPointerMove as EventListener);
      doc.removeEventListener('touchend', onPointerUp as EventListener);
   };

   doc.addEventListener('mousemove', onPointerMove as EventListener);
   doc.addEventListener('mouseup', onPointerUp as EventListener);

   doc.addEventListener('touchmove', onPointerMove as EventListener);
   doc.addEventListener('touchend', onPointerUp as EventListener);
};
