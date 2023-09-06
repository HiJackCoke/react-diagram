import {
   MouseEvent as ReactMouseEvent,
   TouchEvent as ReactTouchEvent,
} from 'react';

import { StoreApi } from 'zustand';

import { getEventPosition } from 'utils';

import { Connection, OnConnect, PortType, ReactDiagramState } from 'types';

export type ConnectionPort = {
   id: string | null;
   type: PortType;
   nodeId: string;
   x: number;
   y: number;
};

type getConnectionResult = {
   isValid: boolean;
   connection: Connection;
};

export const getHostForElement = (
   element: HTMLElement,
): Document | ShadowRoot =>
   (element.getRootNode?.() as Document | ShadowRoot) || window?.document;

const getPortType = (handleDomNode: Element | null): PortType | null => {
   if (handleDomNode?.classList.contains('target')) {
      return 'target';
   } else if (handleDomNode?.classList.contains('source')) {
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

export function handlePointerDown({
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
}): void {
   const doc = getHostForElement(event.target as HTMLElement);
   const { domNode, cancelConnection } = getState();

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

   function onPointerMove(event: MouseEvent | TouchEvent) {
      connectionPosition = getEventPosition(event, containerBounds);

      const result = getConnection(event, nodeId, portType, doc);

      if (result.isValid) {
         isValid = result.isValid;
         connection = result.connection;
      }

      setState({
         connectionPosition: connectionPosition,
      });
   }

   function onPointerUp() {
      if (isValid && connection) onConnect?.(connection);

      cancelConnection();

      isValid = false;
      connection = null;

      doc.removeEventListener('mousemove', onPointerMove as EventListener);
      doc.removeEventListener('mouseup', onPointerUp as EventListener);
   }

   doc.addEventListener('mousemove', onPointerMove as EventListener);
   doc.addEventListener('mouseup', onPointerUp as EventListener);
}
