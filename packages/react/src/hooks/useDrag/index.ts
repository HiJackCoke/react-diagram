import { RefObject, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { select } from 'd3-selection';
import { drag } from 'd3-drag';
import {
   XYPosition,
   calcAutoPanPosition,
   getEventPosition,
   hasChangedPosition,
   hasSelector,
} from '@diagram/core';

import { useStoreApi } from '../../hooks/useStore';
import useGetPointerPosition, {
   PointerPosition,
} from '../useGetPointerPosition';

import { handleNodeClick } from '../../components/Node/utils';

import { getDragItems, calcNextPosition, getEventHandlerParams } from './utils';

import { Node } from '../../types';
import { NodeDragItem } from '../../hooks/useDrag/type';
import { UseDragEvent } from './type';

type UseDragParams = {
   nodeRef: RefObject<Element>;
   nodeId?: string;
   isSelectable?: boolean;
   noDragClassName?: string;
};

const isDragItem = (node: NodeDragItem | Node): node is NodeDragItem =>
   'distance' in node;

function useDrag({
   nodeRef,
   nodeId,
   isSelectable,
   noDragClassName,
}: UseDragParams) {
   const store = useStoreApi();

   const dragItems = useRef<NodeDragItem[]>([]);
   const containerBounds = useRef<DOMRect | null>(null);
   const mousePosition = useRef<XYPosition>({ x: 0, y: 0 });
   const lastPosition = useRef<XYPosition>({ x: 0, y: 0 });
   const dragEvent = useRef<MouseEvent | null>(null);
   const autoPanStarted = useRef(false);
   const autoPanId = useRef(0);

   const [dragging, setDragging] = useState<boolean>(false);

   const getPointerPosition = useGetPointerPosition();

   const updateNodePosition =
      (pointerPositions: PointerPosition, dragEnd = false) =>
      (dragItem: Node | NodeDragItem) => {
         if (!isDragItem(dragItem)) return;

         const { nodeInternals, nodeExtent, nodeOrigin, smoothStep, gridStep } =
            store.getState();

         const { distance, width, height } = dragItem;
         const { x, y, getStepPosition } = pointerPositions;

         let nextPosition = {
            x: x - distance.x,
            y: y - distance.y,
         };

         if (gridStep && getStepPosition) {
            const nodeSize = { width, height };
            const stepPosition = getStepPosition({
               position: nextPosition,
               nodeSize,
            });

            if (!smoothStep || (smoothStep && dragEnd)) {
               nextPosition = stepPosition;
            }
         }

         const updatedPosition = calcNextPosition(
            dragItem,
            nextPosition,
            nodeInternals,
            nodeExtent,
            nodeOrigin,
         );

         const hasChange = hasChangedPosition(
            dragItem.position,
            updatedPosition.position,
         );

         if (!hasChange) return;

         dragItem.position = updatedPosition.position;
         dragItem.positionAbsolute = updatedPosition.positionAbsolute;
      };

   useEffect(() => {
      if (nodeRef?.current) {
         const selection = select(nodeRef.current);

         const updateNodes = (pointerPosition: PointerPosition) => {
            const { nodeInternals, onNodeDrag, updateNodesPosition } =
               store.getState();

            const { x, y } = pointerPosition;

            lastPosition.current = { x, y };

            updateNodesPosition(
               dragItems.current,
               true,
               updateNodePosition(pointerPosition),
            );

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

               lastPosition.current.x -= xMovement / transform[2];
               lastPosition.current.y -= yMovement / transform[2];

               updateNodes(lastPosition.current);
               panBy({ x: xMovement, y: yMovement });
            }
            autoPanId.current = requestAnimationFrame(autoPan);
         };

         const dragHandle = drag()
            .on('start', (event: UseDragEvent) => {
               const {
                  nodeInternals,
                  nodesDraggable,
                  domNode,
                  onNodeDragStart,
                  transform,
                  gridStep,
                  centerStep,
               } = store.getState();

               if (nodeId) {
                  handleNodeClick({
                     id: nodeId,
                     store,
                     nodeRef: nodeRef as RefObject<HTMLDivElement>,
                     isSelectable,
                  });
               }

               const pointerPosition = getPointerPosition(event.sourceEvent, {
                  transform,
                  gridStep,
                  centerStep,
               });

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
                     event.sourceEvent as MouseEvent,
                     currentNode,
                     nodes,
                  );
               }

               containerBounds.current =
                  domNode?.getBoundingClientRect() || null;
               mousePosition.current = getEventPosition(
                  event.sourceEvent,
                  containerBounds.current!,
               );
            })
            .on('drag', (event: UseDragEvent) => {
               const {
                  transform,
                  gridStep,
                  centerStep,
                  autoPanOnNodeDrag,
                  updateNodesIntersection,
               } = store.getState();

               const pointerPosition = getPointerPosition(event.sourceEvent, {
                  transform,
                  gridStep,
                  centerStep,
               });

               if (!autoPanStarted.current && autoPanOnNodeDrag) {
                  autoPanStarted.current = true;
                  autoPan();
               }

               const isChanged = hasChangedPosition(
                  lastPosition.current,
                  pointerPosition.getStepPosition(), // only when not gridStep
               );

               if (isChanged && dragItems.current) {
                  dragEvent.current = event.sourceEvent as MouseEvent;
                  mousePosition.current = getEventPosition(
                     event.sourceEvent,
                     containerBounds.current!,
                  );

                  updateNodes(pointerPosition);

                  updateNodesIntersection();
               }
            })
            .on('end', (event: UseDragEvent) => {
               setDragging(false);

               autoPanStarted.current = false;
               cancelAnimationFrame(autoPanId.current);

               if (dragItems.current) {
                  const {
                     nodeInternals,
                     transform,
                     gridStep,
                     centerStep,
                     smoothStep,
                     updateNodesPosition,
                     updateNodesIntersection,
                     onNodeDragEnd,
                  } = store.getState();

                  const isSmoothStep = !!gridStep && smoothStep;

                  if (isSmoothStep) {
                     const pointerPosition = getPointerPosition(
                        event.sourceEvent,
                        {
                           transform,
                           gridStep,
                           centerStep,
                        },
                     );

                     updateNodesPosition(
                        dragItems.current,
                        false,
                        updateNodePosition(pointerPosition, true),
                     );
                     updateNodesIntersection();
                  } else {
                     updateNodesPosition(dragItems.current, false);
                  }

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

               if (!nodeRef.current) return false;

               const isDraggable =
                  !event.button &&
                  (!noDragClassName ||
                     !hasSelector(
                        target,
                        `.${noDragClassName}`,
                        nodeRef.current,
                     ));

               return isDraggable;
            });

         selection.call(dragHandle);
         return () => {
            selection.on('.drag', null);
         };
      }
   }, [
      store,
      nodeRef,
      nodeId,
      isSelectable,
      noDragClassName,
      getPointerPosition,
   ]);

   return dragging;
}

export default useDrag;
