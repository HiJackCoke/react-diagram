import { memo } from 'react';
import type {
   MouseEvent as ReactMouseEvent,
   TouchEvent as ReactTouchEvent,
} from 'react';

import { Connection, PortProps, CosmosPort, isMouseEvent } from 'cosmos-diagram';

import { useNodeId } from '../../contexts/NodeIdContext';
import { useStoreApi } from '../../hooks/useStore';

function Port({ id, type, position }: PortProps) {
   const portId = id || null;
   const store = useStoreApi();
   const nodeId = useNodeId();

   if (!nodeId) return null;

   const handleOnConnect = (connection: Connection) => {
      const { defaultEdgeOptions, onConnect } = store.getState();

      const edgeParams = {
         ...defaultEdgeOptions,
         ...connection,
      };

      onConnect?.(edgeParams);
   };

   const onPointerDown = (
      event: ReactMouseEvent<HTMLDivElement> | ReactTouchEvent<HTMLDivElement>,
   ) => {
      const isMouseTriggered = isMouseEvent(event.nativeEvent);
      const { button } = event as ReactMouseEvent<HTMLDivElement>;

      if ((isMouseTriggered && button === 0) || !isMouseTriggered) {
         const {
            domNode,
            autoPanOnConnect,
            connectionRadius,
            transform,
            getNodes,
            cancelConnection,
            updateConnection,
            onConnectStart,
            onConnectEnd,
            panBy,
         } = store.getState();

         CosmosPort.onPointerDown({
            event: event.nativeEvent,
            nodeId,
            portId,
            portType: type,
            domNode,
            autoPanOnConnect,
            connectionRadius,
            nodes: getNodes(),
            cancelConnection,
            updateConnection,
            onConnect: handleOnConnect,
            onConnectStart,
            onConnectEnd,
            panBy,
            getTransform: () => transform,
         });
      }
   };

   return (
      <div
         data-nodeid={nodeId}
         data-id={`${nodeId}-${portId}-${type}`}
         data-portid={portId}
         data-port-position={position}
         className={`react-diagram__port react-diagram__port-${position} ${type} nodrag`}
         onMouseDown={onPointerDown}
         onTouchStart={onPointerDown}
      />
   );
}

Port.displayName = 'Port';

export default memo(Port);
