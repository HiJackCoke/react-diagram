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
   hasChangedPosition,
} from './utils';
import { getEventPosition, calcAutoPanPosition } from '../../utils';

import { Node, XYPosition } from '../../types';
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

   const updateNodePosition = (
      pointerPositions: XYPosition,
      dragItem: NodeDragItem,
      dragEnd = false,
   ) => {
      const {
         nodeInternals,
         nodeExtent,
         nodeOrigin,
         smoothStep,
         gridStep,
         onError,
      } = store.getState();

      const { x, y } = pointerPositions;

      const nextPosition = {
         x: x - dragItem.distance.x,
         y: y - dragItem.distance.y,
      };

      if (gridStep) {
         const { x, y } = getStepPosition(gridStep, nextPosition);

         if (!smoothStep || (smoothStep && dragEnd)) {
            nextPosition.x = x;
            nextPosition.y = y;
         }
      }

      const updatedPosition = calcNextPosition(
         dragItem,
         nextPosition,
         nodeInternals,
         nodeExtent,
         nodeOrigin,
         onError,
      );

      return updatedPosition;
   };

   useEffect(() => {
      if (nodeRef?.current) {
         const selection = select(nodeRef.current);

         const updateNodes = ({ x, y }: XYPosition) => {
            const { nodeInternals, onNodeDrag, updateNodesPosition } =
               store.getState();

            lastPosition.current = { x, y };

            let hasChange = false;

            updateNodesPosition(dragItems.current, true, true, (node) => {
               if (isDragItem(node)) {
                  const updatedPosition = updateNodePosition({ x, y }, node);

                  hasChange =
                     hasChange ||
                     hasChangedPosition(
                        node.position,
                        updatedPosition.position,
                     );

                  node.position = updatedPosition.position;
                  node.positionAbsolute = updatedPosition.positionAbsolute;
               }
            });

            if (!hasChange) {
               return;
            }

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

               const isChanged = hasChangedPosition(lastPosition.current, {
                  x: pointerPosition.stepX,
                  y: pointerPosition.stepY,
               });

               if (isChanged && dragItems.current) {
                  dragEvent.current = e.sourceEvent as MouseEvent;
                  mousePosition.current = getEventPosition(
                     e.sourceEvent,
                     containerBounds.current!,
                  );

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
                     updateNodesPosition,
                     onNodeDragEnd,
                  } = store.getState();

                  const isSmoothStep = !!gridStep && smoothStep;

                  if (isSmoothStep) {
                     const pointerPosition = getPointerPosition(event);

                     updateNodesPosition(
                        dragItems.current,
                        true,
                        false,
                        (node) => {
                           if (isDragItem(node)) {
                              const updatedPosition = updateNodePosition(
                                 pointerPosition,
                                 node,
                                 true,
                              );

                              node.position = updatedPosition.position;
                              node.positionAbsolute =
                                 updatedPosition.positionAbsolute;
                           }
                        },
                     );
                  } else {
                     updateNodesPosition(dragItems.current, false, false);
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
