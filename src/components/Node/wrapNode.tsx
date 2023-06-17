import { useEffect, useRef, memo } from 'react';
import type { ComponentType, MouseEvent } from 'react';
import cc from 'classcat';

import useDrag from 'hooks/useDrag';
import { useStoreApi } from 'hooks/useStore';

import { Provider } from 'contexts/NodeIdContext';

import { ARIA_NODE_DESC_KEY } from 'components/A11yDescriptions';

import { getMouseHandler, handleNodeClick } from './utils';

import type { XYPosition } from 'types';
import {
   Node,
   NodeInternals,
   WrapNodeProps,
   NodeProps,
   NodeDragItem,
} from './type';

export const arrowKeyDiffs: Record<string, XYPosition> = {
   ArrowUp: { x: 0, y: -1 },
   ArrowDown: { x: 0, y: 1 },
   ArrowLeft: { x: -1, y: 0 },
   ArrowRight: { x: 1, y: 0 },
};

export function isParentSelected(
   node: Node,
   nodeInternals: NodeInternals,
): boolean {
   if (!node.parentNode) {
      return false;
   }

   const parentNode = nodeInternals.get(node.parentNode);

   if (!parentNode) {
      return false;
   }

   if (parentNode.selected) {
      return true;
   }

   return isParentSelected(parentNode, nodeInternals);
}

export function getDragItems(
   nodeInternals: NodeInternals,
   nodesDraggable: boolean,
   mousePos: XYPosition,
   nodeId?: string,
): NodeDragItem[] {
   return Array.from(nodeInternals.values())
      .filter(
         (n) =>
            (n.selected || n.id === nodeId) &&
            (!n.parentNode || !isParentSelected(n, nodeInternals)) &&
            (n.draggable ||
               (nodesDraggable && typeof n.draggable === 'undefined')),
      )
      .map((n) => ({
         id: n.id,
         position: n.position || { x: 0, y: 0 },
         positionAbsolute: n.positionAbsolute || { x: 0, y: 0 },
         distance: {
            x: mousePos.x - (n.positionAbsolute?.x ?? 0),
            y: mousePos.y - (n.positionAbsolute?.y ?? 0),
         },
         delta: {
            x: 0,
            y: 0,
         },
         extent: n.extent,
         parentNode: n.parentNode,
         width: n.width,
         height: n.height,
      }));
}

export default (NodeComponent: ComponentType<NodeProps>) => {
   function NodeWrapper({
      id,
      type,
      data,
      xPos,
      yPos,
      xPosOrigin,
      yPosOrigin,

      onClick,
      onMouseEnter,
      onMouseMove,
      onMouseLeave,
      onContextMenu,
      onDoubleClick,
      style,
      className,
      selected,
      isSelectable,
      isDraggable,
      sourcePosition,
      targetPosition,
      hidden,

      resizeObserver,

      dragHandle,
      zIndex,
      isParent,

      initialized,
      disableKeyboardA11y,
      ariaLabel,
      rfId,
   }: WrapNodeProps) {
      const store = useStoreApi();

      const nodeRef = useRef<HTMLDivElement>(null);
      const prevSourcePosition = useRef(sourcePosition);
      const prevTargetPosition = useRef(targetPosition);
      const prevType = useRef(type);
      const hasPointerEvents =
         onClick || onMouseEnter || onMouseMove || onMouseLeave;

      const onMouseEnterHandler = getMouseHandler(
         id,
         store.getState,
         onMouseEnter,
      );
      const onMouseMoveHandler = getMouseHandler(
         id,
         store.getState,
         onMouseMove,
      );
      const onMouseLeaveHandler = getMouseHandler(
         id,
         store.getState,
         onMouseLeave,
      );
      const onContextMenuHandler = getMouseHandler(
         id,
         store.getState,
         onContextMenu,
      );
      const onDoubleClickHandler = getMouseHandler(
         id,
         store.getState,
         onDoubleClick,
      );
      const onSelectNodeHandler = (event: MouseEvent) => {
         if (isSelectable && !isDraggable) {
            handleNodeClick({
               id,
               store,
               nodeRef,
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

      useDrag({ nodeRef, nodeId: id, isSelectable });

      if (hidden) {
         return null;
      }

      return (
         <div
            className={cc([
               'react-diagram__node',
               `react-diagram__node-${type}`,

               className,
               {
                  selected,
                  parent: isParent,
                  // dragging,
               },
            ])}
            ref={nodeRef}
            style={{
               zIndex,
               transform: `translate(${xPosOrigin}px,${yPosOrigin}px)`,
               pointerEvents: hasPointerEvents ? 'all' : 'none',
               visibility: initialized ? 'visible' : 'hidden',
               ...style,
            }}
            data-id={id}
            onMouseEnter={onMouseEnterHandler}
            onMouseMove={onMouseMoveHandler}
            onMouseLeave={onMouseLeaveHandler}
            onContextMenu={onContextMenuHandler}
            onClick={onSelectNodeHandler}
            onDoubleClick={onDoubleClickHandler}
            tabIndex={0}
            role="button"
            aria-describedby={
               disableKeyboardA11y ? undefined : `${ARIA_NODE_DESC_KEY}-${rfId}`
            }
            aria-label={ariaLabel}
         >
            <Provider value={id}>
               <NodeComponent
                  id={id}
                  data={data}
                  type={type}
                  xPos={xPos}
                  yPos={yPos}
                  sourcePosition={sourcePosition}
                  targetPosition={targetPosition}
                  dragHandle={dragHandle}
                  zIndex={zIndex}
               />
            </Provider>
         </div>
      );
   }

   NodeWrapper.displayName = 'NodeWrapper';

   return memo(NodeWrapper);
};
