import type {
   MouseEvent as ReactMouseEvent,
   TouchEvent as ReactTouchEvent,
} from 'react';

import { useNodeId } from 'contexts/NodeIdContext';
import { useStoreApi } from 'hooks/useStore';

import { isMouseEvent } from 'utils';

import { handlePointerDown } from './utils';

import { PortProps } from './type';

import './style.css';

function Port({ type, position }: PortProps) {
   const store = useStoreApi();
   const nodeId = useNodeId();

   if (!nodeId) return null;

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
