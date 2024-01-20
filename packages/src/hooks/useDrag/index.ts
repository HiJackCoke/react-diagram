import { RefObject, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { select } from 'd3-selection';
import { drag } from 'd3-drag';

import { useStoreApi } from '../../hooks/useStore';
import useGetPointerPosition, {
   PointerPosition,
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

import { Node, NodeIntersectionChange, XYPosition } from '../../types';
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
   const intersectionChanges = useRef<NodeIntersectionChange[]>([]);

   const [dragging, setDragging] = useState<boolean>(false);

   const getPointerPosition = useGetPointerPosition();

   const updateNodesIntersection = (
      dragItem: Node | NodeDragItem,
      intersected = true,
   ) => {
      const { getNodes, triggerNodeChanges } = store.getState();

      const intersectedNodes = getNodes().filter((node) => {
         if (!dragItem.width || !dragItem.height) return;
         if (!node.width || !node.height) return;
         if (node.id === dragItem.id) return;
         if (node.parentNode) return;

         const { position: nodePosition } = node;
         const { position, width, height } = dragItem;

         const leftIn = position.x + width >= nodePosition.x;
         const rightIn = nodePosition.x + node.width >= position.x;
         const topIn = position.y + height >= nodePosition.y;
         const bottomIn = nodePosition.y + node.height >= position.y;

         return leftIn && rightIn && topIn && bottomIn;
         // && !node.intersected;
      });

      const changes: NodeIntersectionChange[] = intersectedNodes.map((node) => {
         return {
            id: node.id,
            type: 'intersect',
            intersected,
         };
      });

      const beforeChanges = resetIntersectedNodes(intersectedNodes);

      triggerNodeChanges([...changes, ...beforeChanges]);
   };

   const resetIntersectedNodes = (intersectedNodes: Node[]) => {
      const hasIntersectedNodes = intersectedNodes.length;

      let beforeChanges;

      if (hasIntersectedNodes) {
         beforeChanges = intersectionChanges.current
            .filter((beforeChange) => {
               const toFalse = intersectedNodes.some(
                  (intersectedNode) => beforeChange.id !== intersectedNode.id,
               );
               return toFalse;
            })
            .map((beforeChange) => ({
               ...beforeChange,
               intersected: false,
            }));
      } else {
         beforeChanges = intersectionChanges.current.map((beforeChange) => ({
            ...beforeChange,
            intersected: false,
         }));
      }

      const changes: NodeIntersectionChange[] = intersectedNodes.map((node) => {
         return {
            id: node.id,
            type: 'intersect',
            intersected: true,
         };
      });

      intersectionChanges.current = changes;

      return beforeChanges;
   };

   const updateNodePosition =
      (pointerPositions: PointerPosition, dragEnd = false) =>
      (dragItem: Node | NodeDragItem) => {
         if (!isDragItem(dragItem)) return;

         const {
            nodeInternals,
            nodeExtent,
            nodeOrigin,
            smoothStep,
            gridStep,
            onError,
         } = store.getState();

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
            onError,
         );

         const hasChange = hasChangedPosition(
            dragItem.position,
            updatedPosition.position,
         );

         if (!hasChange) return;

         dragItem.position = updatedPosition.position;
         dragItem.positionAbsolute = updatedPosition.positionAbsolute;

         if (!gridStep) {
            updateNodesIntersection(dragItem);
         }
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
            .on('start', (e: UseDragEvent) => {
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

               const isChanged = hasChangedPosition(
                  lastPosition.current,
                  pointerPosition.getStepPosition(), // only when not gridStep
               );

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
                        false,
                        updateNodePosition(pointerPosition, true),
                     );
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

               const isDraggable =
                  !event.button &&
                  (!noDragClassName ||
                     !hasSelector(target, `.${noDragClassName}`, nodeRef));

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
