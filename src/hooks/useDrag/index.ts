import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { select } from 'd3-selection';
import { drag } from 'd3-drag';

import { useStoreApi } from 'hooks/useStore';
import useGetPointerPosition from 'hooks/useGetPointerPosition';

import {
   getDragItems,
   getEventPosition,
   calcNextPosition,
   getEventHandlerParams,
} from './utils';

import { XYPosition } from 'types';
import { NodeDragItem } from 'components/Node/type';
import { UseDragParams, UseDragEvent } from './type';

function useDrag({ nodeRef, nodeId }: UseDragParams) {
   const store = useStoreApi();
   const [dragging, setDragging] = useState<boolean>(false);

   const dragItems = useRef<NodeDragItem[]>([]);
   const containerBounds = useRef<DOMRect | null>(null);
   const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
   const lastPosition = useRef<{ x: number | null; y: number | null }>({
      x: null,
      y: null,
   });
   const dragEvent = useRef<MouseEvent | null>(null);

   const getPointerPosition = useGetPointerPosition();

   useEffect(() => {
      if (nodeRef?.current) {
         const selection = select(nodeRef.current);

         const updateNodes = ({ x, y }: XYPosition) => {
            const {
               nodeInternals,
               onNodeDrag,
               updateNodePositions,
               nodeExtent,
               nodeOrigin,
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
                  nextPosition.x =
                     gridStep[0] * Math.round(nextPosition.x / gridStep[0]);
                  nextPosition.y =
                     gridStep[1] * Math.round(nextPosition.y / gridStep[1]);
               }

               const updatedPos = calcNextPosition(
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
                  n.position.x !== updatedPos.position.x ||
                  n.position.y !== updatedPos.position.y;

               n.position = updatedPos.position;
               n.positionAbsolute = updatedPos.positionAbsolute;

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

         const dragHandle = drag()
            .on('start', (e: UseDragEvent) => {
               const {
                  nodeInternals,
                  nodesDraggable,
                  domNode,
                  onNodeDragStart,
               } = store.getState();

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

               if (
                  (lastPosition.current.x !== pointerPosition.xSnapped ||
                     lastPosition.current.y !== pointerPosition.ySnapped) &&
                  dragItems.current
               ) {
                  dragEvent.current = e.sourceEvent as MouseEvent;
                  mousePosition.current = getEventPosition(
                     e.sourceEvent,
                     containerBounds.current!,
                  );

                  updateNodes(pointerPosition);
               }
            });

         selection.call(dragHandle);
         return () => {
            selection.on('.drag', null);
         };
      }
   }, [nodeRef, nodeId, store]);

   return dragging;
}

export default useDrag;
