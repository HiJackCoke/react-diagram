import {
   MouseEvent as ReactMouseEvent,
   TouchEvent as ReactTouchEvent,
} from 'react';

import { StoreApi } from 'zustand';

import { getEventPosition, internalsSymbol } from 'utils';

import {
   Connection,
   Node,
   NodePortBounds,
   OnConnect,
   PortType,
   ReactDiagramState,
} from 'types';

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

   if (isTarget) return result;

   const { x, y } = getEventPosition(event);
   const ElementFromPoint = doc.elementFromPoint(x, y);
   const Port = ElementFromPoint?.classList.contains('react-diagram__port')
      ? ElementFromPoint
      : null;

   if (Port) {
      const portType = getPortType(Port);
      const toNodeId = Port.getAttribute('data-nodeid');

      const connection = {
         source: fromNodeId,
         target: toNodeId,
      };

      result.connection = connection;

      const isValid = !isTarget && portType === 'target';

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

export const handlePointerDown = ({
   event,
   nodeId,
   portType,
   getState,
   setState,
   onConnect,
}: {
   event: ReactMouseEvent | ReactTouchEvent;
   nodeId: string;
   portType: PortType;
   getState: StoreApi<ReactDiagramState>['getState'];
   setState: StoreApi<ReactDiagramState>['setState'];
   onConnect: OnConnect;
}): void => {
   const doc = getHostForElement(event.target as HTMLElement);
   const { getNodes, domNode, cancelConnection } = getState();

   const containerBounds = domNode?.getBoundingClientRect();

   const { x, y } = getEventPosition(event);
   const clickedPort = doc?.elementFromPoint(x, y);
   const clickedPortType = getPortType(clickedPort);

   let connectionPosition = getEventPosition(event, containerBounds);
   let isValid = false;
   let connection: Connection | null = null;

   setState({
      connectionPosition,
      connectionNodeId: nodeId,
      connectionPortType: clickedPortType,
   });

   const onPointerMove = (event: MouseEvent | TouchEvent) => {
      connectionPosition = getEventPosition(event, containerBounds);

      const result = getConnection(event, nodeId, portType, doc);

      if (result.isValid) {
         isValid = result.isValid;
         connection = result.connection;
      }

      setState({
         connectionPosition: connectionPosition,
      });
   };

   const allPort = getAllPort({
      nodes: getNodes(),
      nodeId,
      portType,
   });

   console.log(allPort);

   const onPointerUp = () => {
      if (isValid && connection) onConnect?.(connection);

      cancelConnection();

      isValid = false;
      connection = null;

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
