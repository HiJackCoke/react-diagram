import { useEffect, useRef, memo } from 'react';
import type { ComponentType, MouseEvent } from 'react';
import cc from 'classcat';

import { select } from 'd3-selection';
import { drag } from 'd3-drag';

import { Provider } from '../../contexts/NodeIdContext';
import { useStoreApi } from '../../hooks/useStore';
import useGetPointerPosition from 'hooks/useGetPointerPosition';

import { getMouseHandler } from './utils';

import type {
   NodeProps,
   WrapNodeProps,
   XYPosition,
   NodeDragItem,
   UseDragEvent,
   NodeInternals,
   Node,
} from '../../types';

const ARIA_NODE_DESC_KEY = 'react-diagram__node-desc';

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
   const NodeWrapper = ({
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

      sourcePosition,
      targetPosition,
      hidden,

      dragHandle,
      zIndex,
      isParent,

      initialized,
      disableKeyboardA11y,
      ariaLabel,
      rfId,
   }: WrapNodeProps) => {
      const store = useStoreApi();
      const getPointerPosition = useGetPointerPosition();

      const nodeRef = useRef<HTMLDivElement>(null);
      const prevSourcePosition = useRef(sourcePosition);
      const prevTargetPosition = useRef(targetPosition);
      const prevType = useRef(type);
      const hasPointerEvents =
         onClick || onMouseEnter || onMouseMove || onMouseLeave;
      // const updatePositions = useUpdateNodePositions();

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
         // this handler gets called within the drag start event when selectNodesOnDrag=true

         if (onClick) {
            const node = store.getState().nodeInternals.get(id)!;
            onClick(event, { ...node });
         }
      };

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

      useEffect(() => {
         if (nodeRef?.current) {
            const selection = select(nodeRef.current);

            const dragHandle = drag().on('start', (e: UseDragEvent) => {
               const pointerPos = getPointerPosition(e);

               console.log(pointerPos);
            });

            selection.call(dragHandle);
         }
      }, [nodeRef, id, store]);

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
   };

   NodeWrapper.displayName = 'NodeWrapper';

   return memo(NodeWrapper);
};
