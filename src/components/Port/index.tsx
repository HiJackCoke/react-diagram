import type {
   MouseEvent as ReactMouseEvent,
   TouchEvent as ReactTouchEvent,
} from 'react';

import { useNodeId } from 'contexts/NodeIdContext';
import { useStoreApi } from 'hooks/useStore';

import { isMouseEvent } from 'utils';

import { handlePointerDown } from './utils';

import { Connection } from 'types';

import { PortProps } from './type';

import './style.css';

function Port({ type, position }: PortProps) {
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
      const isMouseTriggered = isMouseEvent(event);

      if ((isMouseTriggered && event.button === 0) || !isMouseTriggered) {
         handlePointerDown({
            event,
            nodeId,
            portType: type,
            getState: store.getState,
            setState: store.setState,
            onConnect: handleOnConnect,
         });
      }
   };

   return (
      <div
         data-nodeid={nodeId}
         data-port-position={position}
         className={`react-diagram__port react-diagram__port-${position} ${type} nodrag`}
         onMouseDown={onPointerDown}
      />
   );
}

export default Port;
