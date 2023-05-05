import { useEffect, useRef, useState } from 'react';
import type { RefObject, MouseEvent } from 'react';
import { select } from 'd3-selection';
import { drag } from 'd3-drag';

import { useStoreApi } from '../../hooks/useStore';
import useGetPointerPosition from 'hooks/useGetPointerPosition';

import {
   getDragItems,
   getEventPosition,
   calcNextPosition,
   getEventHandlerParams,
} from './utils';

import { NodeDragItem, UseDragEvent, XYPosition } from 'types';

type UseDragParams = {
   nodeRef: RefObject<Element>;
   nodeId?: string;
};

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
               onError,
            } = store.getState();

            lastPosition.current = { x, y };

            let hasChange = false;

            dragItems.current = dragItems.current.map((n) => {
               const nextPosition = {
                  x: x - n.distance.x,
                  y: y - n.distance.y,
               };

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

               const PointerPosition = getPointerPosition(e);

               dragItems.current = getDragItems(
                  nodeInternals,
                  nodesDraggable,
                  PointerPosition,
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
               const PointerPosition = getPointerPosition(e);

               if (
                  (lastPosition.current.x !== PointerPosition.xSnapped ||
                     lastPosition.current.y !== PointerPosition.ySnapped) &&
                  dragItems.current
               ) {
                  dragEvent.current = e.sourceEvent as MouseEvent;
                  mousePosition.current = getEventPosition(
                     e.sourceEvent,
                     containerBounds.current!,
                  );

                  updateNodes(PointerPosition);
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
