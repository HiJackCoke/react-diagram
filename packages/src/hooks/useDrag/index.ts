import { RefObject, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { select } from 'd3-selection';
import { drag } from 'd3-drag';

import { useStoreApi } from '../../hooks/useStore';
import useGetPointerPosition, {
   getStepPosition,
} from '../useGetPointerPosition';

import { handleNodeClick } from '../../components/Node/utils';

import {
   getDragItems,
   calcNextPosition,
   getEventHandlerParams,
   hasSelector,
} from './utils';
import { getEventPosition, calcAutoPanPosition } from '../../utils';

import { XYPosition } from '../../types';
import { NodeDragItem } from '../../hooks/useDrag/type';
import { UseDragEvent } from './type';

type UseDragParams = {
   nodeRef: RefObject<Element>;
   nodeId?: string;
   isSelectable?: boolean;
   noDragClassName?: string;
};

function useDrag({
   nodeRef,
   nodeId,
   isSelectable,
   noDragClassName,
}: UseDragParams) {
   const store = useStoreApi();

   const dragItems = useRef<NodeDragItem[]>([]);
   const containerBounds = useRef<DOMRect | null>(null);
   const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
   const lastPosition = useRef<{ x: number | null; y: number | null }>({
      x: null,
      y: null,
   });
   const dragEvent = useRef<MouseEvent | null>(null);
   const autoPanStarted = useRef(false);
   const autoPanId = useRef(0);

   const [dragging, setDragging] = useState<boolean>(false);

   const getPointerPosition = useGetPointerPosition();

   useEffect(() => {
      if (nodeRef?.current) {
         const selection = select(nodeRef.current);

         const updateNodes = ({ x, y }: XYPosition, dragEnd?: boolean) => {
            const {
               nodeInternals,
               onNodeDrag,
               updateNodePositions,
               nodeExtent,
               nodeOrigin,
               smoothStep,
               gridStep,
               onError,
            } = store.getState();

            lastPosition.current = { x, y };

            let hasChange = false;

            dragItems.current = dragItems.current.map((n) => {
               const nextPosition = {
                  x: x - n.distance.x,
                  y: y - n.distance.y,
               };

               if (gridStep) {
                  const { x, y } = getStepPosition(gridStep, nextPosition);

                  if (!smoothStep || (smoothStep && dragEnd)) {
                     nextPosition.x = x;
                     nextPosition.y = y;
                  }
               }

               const updatedPosition = calcNextPosition(
                  n,
                  nextPosition,
                  nodeInternals,
                  nodeExtent,
                  nodeOrigin,
                  onError,
               );

               // we want to make sure that we only fire a change event when there is a changes
               hasChange =
                  hasChange ||
                  n.position.x !== updatedPosition.position.x ||
                  n.position.y !== updatedPosition.position.y;

               n.position = updatedPosition.position;
               n.positionAbsolute = updatedPosition.positionAbsolute;

               return n;
            });

            if (!hasChange) {
               return;
            }

            updateNodePositions(dragItems.current, true, true);
            setDragging(true);

            if (onNodeDrag && dragEvent.current) {
               const [currentNode, nodes] = getEventHandlerParams({
                  nodeId,
                  dragItems: dragItems.current,
                  nodeInternals,
               });
               onNodeDrag(dragEvent.current as MouseEvent, currentNode, nodes);
            }
         };

         const autoPan = (): void => {
            if (!containerBounds.current) {
               return;
            }

            const [xMovement, yMovement] = calcAutoPanPosition(
               mousePosition.current,
               containerBounds.current,
            );

            if (xMovement !== 0 || yMovement !== 0) {
               const { transform, panBy } = store.getState();

               lastPosition.current.x =
                  (lastPosition.current.x ?? 0) - xMovement / transform[2];
               lastPosition.current.y =
                  (lastPosition.current.y ?? 0) - yMovement / transform[2];

               updateNodes(lastPosition.current as XYPosition);
               panBy({ x: xMovement, y: yMovement });
            }
            autoPanId.current = requestAnimationFrame(autoPan);
         };

         const dragHandle = drag()
            .on('start', (e: UseDragEvent) => {
               // only allow left click
               if (e.sourceEvent.which !== 1) return;

               const {
                  nodeInternals,
                  nodesDraggable,
                  domNode,
                  onNodeDragStart,
               } = store.getState();

               if (nodeId) {
                  handleNodeClick({
                     id: nodeId,
                     store,
                     nodeRef: nodeRef as RefObject<HTMLDivElement>,
                     isSelectable,
                  });
               }

               const pointerPosition = getPointerPosition(e);

               dragItems.current = getDragItems(
                  nodeInternals,
                  nodesDraggable,
                  pointerPosition,
                  nodeId,
               );

               if (onNodeDragStart && dragItems.current) {
                  const [currentNode, nodes] = getEventHandlerParams({
                     nodeId,
                     dragItems: dragItems.current,
                     nodeInternals,
                  });

                  onNodeDragStart(
                     e.sourceEvent as MouseEvent,
                     currentNode,
                     nodes,
                  );
               }

               containerBounds.current =
                  domNode?.getBoundingClientRect() || null;
               mousePosition.current = getEventPosition(
                  e.sourceEvent,
                  containerBounds.current!,
               );
            })
            .on('drag', (e: UseDragEvent) => {
               const pointerPosition = getPointerPosition(e);
               const { autoPanOnNodeDrag } = store.getState();

               if (!autoPanStarted.current && autoPanOnNodeDrag) {
                  autoPanStarted.current = true;
                  autoPan();
               }

               if (
                  (lastPosition.current.x !== pointerPosition.stepX ||
                     lastPosition.current.y !== pointerPosition.stepY) &&
                  dragItems.current
               ) {
                  dragEvent.current = e.sourceEvent as MouseEvent;
                  mousePosition.current = getEventPosition(
                     e.sourceEvent,
                     containerBounds.current!,
                  );

                  console.log(pointerPosition);

                  updateNodes(pointerPosition);
               }
            })
            .on('end', (event: UseDragEvent) => {
               setDragging(false);

               autoPanStarted.current = false;
               cancelAnimationFrame(autoPanId.current);

               if (dragItems.current) {
                  const {
                     nodeInternals,
                     smoothStep,
                     gridStep,
                     updateNodePositions,
                     onNodeDragEnd,
                  } = store.getState();

                  if (gridStep) {
                     const pointerPosition = getPointerPosition(event);

                     if (smoothStep) updateNodes(pointerPosition, true);
                  }

                  updateNodePositions(dragItems.current, false, false);

                  if (onNodeDragEnd) {
                     const [currentNode, nodes] = getEventHandlerParams({
                        nodeId,
                        dragItems: dragItems.current,
                        nodeInternals,
                     });
                     onNodeDragEnd(
                        event.sourceEvent as MouseEvent,
                        currentNode,
                        nodes,
                     );
                  }
               }
            })
            .filter((event: MouseEvent) => {
               const target = event.target as HTMLDivElement;

               const isDraggable =
                  (!event.button && !noDragClassName) ||
                  !hasSelector(target, `.${noDragClassName}`, nodeRef);

               return isDraggable;
            });

         selection.call(dragHandle);
         return () => {
            selection.on('.drag', null);
         };
      }
   }, [store, nodeRef, nodeId, isSelectable, noDragClassName]);

   return dragging;
}

export default useDrag;
