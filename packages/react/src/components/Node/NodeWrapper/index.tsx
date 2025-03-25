import { useEffect, useRef, memo } from 'react';
import type { CSSProperties, ComponentType, MouseEvent } from 'react';
import cc from 'classcat';

import useDrag from '../../../hooks/useDrag';
import { useStoreApi } from '../../../hooks/useStore';

import { Provider } from '../../../contexts/NodeIdContext';

import { ARIA_NODE_DESC_KEY } from '../../A11yDescriptions';

import { getMouseHandler, handleNodeClick } from '../utils';

import { XYPosition } from '@diagram/core';
import { NodeProps } from '../type';
import { NodeWrapperProps } from './type';

export const arrowKeyDiffs: Record<string, XYPosition> = {
   ArrowUp: { x: 0, y: -1 },
   ArrowDown: { x: 0, y: 1 },
   ArrowLeft: { x: -1, y: 0 },
   ArrowRight: { x: 1, y: 0 },
};

const wrapNode = (NodeComponent: ComponentType<NodeProps>) => {
   function NodeWrapper({
      id,
      type,
      data,

      positionX,
      positionY,
      sourcePosition,
      targetPosition,

      onClick,
      onMouseEnter,
      onMouseMove,
      onMouseLeave,
      onContextMenu,
      onDoubleClick,
      style,
      width,
      height,
      className,
      selected,
      isSelectable,
      isDraggable,
      intersected,

      hidden,

      resizeObserver,

      dragHandle,
      zIndex,
      isParent,

      initialized,
      disableKeyboardA11y,
      ariaLabel,
      rfId,

      noDragClassName,
      noPanClassName,
   }: NodeWrapperProps) {
      const store = useStoreApi();

      const nodeRef = useRef<HTMLDivElement>(null);
      const prevSourcePosition = useRef(sourcePosition);
      const prevTargetPosition = useRef(targetPosition);
      const prevType = useRef(type);
      const hasPointerEvents =
         isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;

      const onSelectNodeHandler = (event: MouseEvent) => {
         if (!isDraggable) {
            handleNodeClick({
               id,
               store,
               nodeRef,
               isSelectable,
            });
         }

         if (onClick) {
            const node = store.getState().nodeInternals.get(id)!;
            onClick(event, { ...node });
         }
      };

      useEffect(() => {
         if (nodeRef.current && !hidden) {
            const currNode = nodeRef.current;
            resizeObserver?.observe(currNode);

            return () => resizeObserver?.unobserve(currNode);
         }
      }, [hidden]);

      useEffect(() => {
         // when the user programmatically changes the source or handle position, we re-initialize the node
         const typeChanged = prevType.current !== type;
         const sourcePosChanged = prevSourcePosition.current !== sourcePosition;
         const targetPosChanged = prevTargetPosition.current !== targetPosition;

         if (
            nodeRef.current &&
            (typeChanged || sourcePosChanged || targetPosChanged)
         ) {
            if (typeChanged) {
               prevType.current = type;
            }
            if (sourcePosChanged) {
               prevSourcePosition.current = sourcePosition;
            }
            if (targetPosChanged) {
               prevTargetPosition.current = targetPosition;
            }
            store
               .getState()
               .updateNodeDimensions([
                  { id, nodeElement: nodeRef.current, forceUpdate: true },
               ]);
         }
      }, [id, type, sourcePosition, targetPosition]);

      const dragging = useDrag({
         nodeRef,
         nodeId: id,
         disabled: hidden || !isDraggable,
         isSelectable,
         noDragClassName,
      });

      if (hidden) {
         return null;
      }

      const wrapperClassName = cc([
         'react-diagram__node',
         `react-diagram__node-${type}`,
         {
            [noPanClassName]: isDraggable,
         },
         className,
         {
            selected,
            intersected,
            parent: isParent,
            dragging,
         },
      ]);

      const wrapperStyle: CSSProperties = {
         zIndex,
         transform: `translate(${positionX}px,${positionY}px)`,
         pointerEvents: hasPointerEvents ? 'all' : 'none',
         visibility: initialized ? 'visible' : 'hidden',
         width,
         height,
         ...style,
      };

      const events = {
         onClick: onSelectNodeHandler,
         onDoubleClick: getMouseHandler(id, store.getState, onDoubleClick),
         onContextMenu: getMouseHandler(id, store.getState, onContextMenu),
         onMouseEnter: getMouseHandler(id, store.getState, onMouseEnter),
         onMouseMove: getMouseHandler(id, store.getState, onMouseMove),
         onMouseLeave: getMouseHandler(id, store.getState, onMouseLeave),
      };

      const position = {
         positionX,
         positionY,
         sourcePosition,
         targetPosition,
      };

      return (
         <div
            {...events}
            ref={nodeRef}
            className={wrapperClassName}
            style={wrapperStyle}
            data-id={id}
            tabIndex={0}
            role="button"
            aria-describedby={
               disableKeyboardA11y ? undefined : `${ARIA_NODE_DESC_KEY}-${rfId}`
            }
            aria-label={ariaLabel}
         >
            <Provider value={id}>
               <NodeComponent
                  {...position}
                  id={id}
                  zIndex={zIndex}
                  type={type}
                  data={data}
                  dragHandle={dragHandle}
                  selected={selected}
                  intersected={intersected}
               />
            </Provider>
         </div>
      );
   }

   NodeWrapper.displayName = 'NodeWrapper';

   return memo(NodeWrapper);
};

export default wrapNode;
