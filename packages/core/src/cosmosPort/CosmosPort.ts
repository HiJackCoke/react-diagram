import {
   ConnectingPort,
   Connection,
   ConnectionPort,
   CoreNode,
   OnConnect,
   OnConnectEnd,
   OnConnectStart,
   PanBy,
   PortType,
   Transform,
   UpdateConnection,
} from '../types';
import {
   getEventPosition,
   getHostForElement,
   pointToRendererPoint,
   rendererPointToPoint,
} from '../utils';
import { calcAutoPanPosition } from '../utils/general';
import {
   getAllPort,
   getClosestPort,
   getConnection,
   getPortType,
} from './utils';

export type OnPointerDown = {
   isAnchor?: boolean;
   event: MouseEvent | TouchEvent;
   nodeId: string;
   portId: string | null;
   portType: PortType;
   // getState: StoreApi<ReactDiagramState>['getState'];
   domNode: HTMLDivElement | null;
   autoPanOnConnect: boolean;
   connectionRadius: number;
   //    getNodes;
   nodes: CoreNode[];
   cancelConnection: () => void;
   onConnect?: OnConnect;
   onConnectStart?: OnConnectStart;
   onConnectEnd?: OnConnectEnd;
   panBy: PanBy;
   getTransform: () => Transform;
   updateConnection: UpdateConnection;
   onEdgeUpdateEnd?: (evt: MouseEvent | TouchEvent) => void;
};

let connectionStartPort: ConnectingPort | null = null;

export const onPointerDown = ({
   isAnchor = false,
   event,
   nodeId,
   portId,
   portType,
   domNode,
   autoPanOnConnect,
   connectionRadius,
   nodes,
   getTransform,
   cancelConnection,
   onConnectStart,
   onConnect,
   onConnectEnd,
   onEdgeUpdateEnd,
   panBy,
   updateConnection,
}: OnPointerDown): void => {
   const doc = getHostForElement(event.target as HTMLElement);

   const containerBounds = domNode?.getBoundingClientRect();

   const { x, y } = getEventPosition(event);
   const clickedPort = doc?.elementFromPoint(x, y);
   const clickedPortType = isAnchor ? portType : getPortType(clickedPort);
   const allPort = getAllPort({
      nodes,
      nodeId,
      portId,
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

   connectionStartPort = {
      nodeId,
      portId,
      portType: clickedPortType,
   };
   updateConnection({
      connectionPosition,
      connectionStartPort,
      connectionEndPort: null,
   });

   onConnectStart?.(event, { nodeId, portId, portType });

   const onPointerMove = (event: MouseEvent | TouchEvent) => {
      const transform = getTransform();

      connectionPosition = getEventPosition(event, containerBounds);

      closestPort = getClosestPort(
         pointToRendererPoint(connectionPosition, transform),
         connectionRadius,
         allPort,
      );

      if (!autoPanStarted) {
         autoPan();
         autoPanStarted = true;
      }

      const result = getConnection(event, closestPort, nodeId, portId, portType, doc);

      isValid = result.isValid;
      connection = result.connection;

      updateConnection({
         connectionPosition:
            closestPort && isValid
               ? rendererPointToPoint(closestPort, transform)
               : connectionPosition,

         connectionStartPort,
         connectionEndPort: result.endPort,
      });
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

export const CosmosPort = {
   onPointerDown,
};
