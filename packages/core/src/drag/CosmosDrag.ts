import type { MouseEvent } from 'react';
import { Selection, select } from 'd3-selection';
import { drag } from 'd3-drag';
import {
   calcAutoPanPosition,
   calcNextPosition,
   getEventPosition,
   getPointerPosition,
} from '../utils';

import {
   getDragItems,
   getEventHandlerParams,
   hasChangedPosition,
   hasSelector,
} from './utils';
import type {
   CoordinateExtent,
   CoreNode,
   GridStep,
   NodeDragItem,
   NodeInternals,
   NodeOrigin,
   PanBy,
   Transform,
   UseDragEvent,
   XYPosition,
} from '../types';

export type OnDrag = (
   event: MouseEvent,
   dragItems: NodeDragItem[],
   node: CoreNode,
   nodes: CoreNode[],
) => void;

export type DragUpdateParams = {
   domNode: Element;
   nodeId?: string;
   isSelectable?: boolean;
   noDragClassName?: string;
};

export type DragInstance = {
   update: (params: DragUpdateParams) => void;
   destroy: () => void;
};

type NodeSize = {
   width: number;
   height: number;
};

type StepPositionParams = {
   position: XYPosition;
   nodeSize?: NodeSize;
};

type GetStepPosition = (params?: StepPositionParams) => XYPosition;

type PointerPosition = XYPosition & {
   getStepPosition?: GetStepPosition;
};

type StoreItems = {
   transform: Transform;
   nodeInternals: NodeInternals;
   domNode: HTMLDivElement | null;
   nodeOrigin: NodeOrigin;
   smoothStep: boolean;
   centerStep: boolean;
   gridStep?: GridStep;
   nodesDraggable: boolean;
   autoPanOnNodeDrag: boolean;
   nodeExtent: CoordinateExtent;

   updateNodesPosition: (
      nodeDragItems: NodeDragItem[] | CoreNode[],
      dragging: boolean,
      updateFunc?: (node: NodeDragItem | CoreNode) => void,
   ) => void;
   panBy: PanBy;
   updateNodesIntersection: () => void;
};

interface Props {
   getStore: () => StoreItems;
   onNodeMouseDown?: (nodeId: string) => void;
   onDragStart?: OnDrag;
   onDrag?: OnDrag;
   onDragEnd?: OnDrag;
}

const isDragItem = (node: NodeDragItem | CoreNode): node is NodeDragItem =>
   'distance' in node;

export const CosmosDrag = ({
   getStore,
   onNodeMouseDown,
   onDragStart,
   onDrag,
   onDragEnd,
}: Props) => {
   let dragItems: NodeDragItem[] = [];
   let containerBounds: DOMRect | null = null;
   let mousePosition: XYPosition = { x: 0, y: 0 };
   let lastPosition: XYPosition = { x: 0, y: 0 };
   let dragEvent: MouseEvent | null = null;
   let autoPanStarted = false;
   let autoPanId = 0;
   let d3Selection: Selection<Element, unknown, null, undefined> | null = null;

   const update = ({ domNode, nodeId, noDragClassName }: DragUpdateParams) => {
      const updateNodePosition =
         (pointerPositions: PointerPosition, dragEnd = false) =>
         (dragItem: CoreNode | NodeDragItem) => {
            if (!isDragItem(dragItem)) return;

            const {
               nodeInternals,
               nodeExtent,
               nodeOrigin,
               smoothStep,
               gridStep,
            } = getStore();

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

      d3Selection = select(domNode);

      const updateNodes = (pointerPosition: PointerPosition) => {
         const { nodeInternals, updateNodesPosition } = getStore();

         const { x, y } = pointerPosition;

         lastPosition = { x, y };

         updateNodesPosition(
            dragItems,
            true,
            updateNodePosition(pointerPosition),
         );

         if (onDrag && dragEvent) {
            const [currentNode, nodes] = getEventHandlerParams({
               nodeId,
               dragItems: dragItems,
               nodeInternals,
            });
            onDrag(dragEvent as MouseEvent, dragItems, currentNode, nodes);
         }
      };

      const autoPan = (): void => {
         if (!containerBounds) {
            return;
         }

         const [xMovement, yMovement] = calcAutoPanPosition(
            mousePosition,
            containerBounds,
         );

         if (xMovement !== 0 || yMovement !== 0) {
            const { transform, panBy } = getStore();

            lastPosition.x -= xMovement / transform[2];
            lastPosition.y -= yMovement / transform[2];

            updateNodes(lastPosition);
            panBy({ x: xMovement, y: yMovement });
         }
         autoPanId = requestAnimationFrame(autoPan);
      };

      const startDrag = (event: UseDragEvent) => {
         const {
            nodeInternals,
            nodesDraggable,
            domNode,

            transform,
            gridStep,
            centerStep,
         } = getStore();

         if (nodeId) {
            onNodeMouseDown?.(nodeId);
         }

         const pointerPosition = getPointerPosition(event.sourceEvent, {
            transform,
            gridStep,
            centerStep,
         });

         dragItems = getDragItems(
            nodeInternals,
            nodesDraggable,
            pointerPosition,
            nodeId,
         );

         if (onDragStart && dragItems) {
            const [currentNode, nodes] = getEventHandlerParams({
               nodeId,
               dragItems: dragItems,
               nodeInternals,
            });

            onDragStart?.(event.sourceEvent, dragItems, currentNode, nodes);
         }

         containerBounds = domNode?.getBoundingClientRect() || null;
         mousePosition = getEventPosition(event.sourceEvent, containerBounds!);
      };

      const dragHandle = drag()
         .on('start', (event: UseDragEvent) => {
            startDrag(event);
         })
         .on('drag', (event: UseDragEvent) => {
            const {
               transform,
               gridStep,
               centerStep,
               autoPanOnNodeDrag,
               updateNodesIntersection,
            } = getStore();

            const pointerPosition = getPointerPosition(event.sourceEvent, {
               transform,
               gridStep,
               centerStep,
            });

            if (!autoPanStarted && autoPanOnNodeDrag) {
               autoPanStarted = true;
               autoPan();
            }

            const isChanged = hasChangedPosition(
               lastPosition,
               pointerPosition.getStepPosition(), // only when not gridStep
            );

            if (isChanged && dragItems) {
               dragEvent = event.sourceEvent as MouseEvent;
               mousePosition = getEventPosition(
                  event.sourceEvent,
                  containerBounds!,
               );

               updateNodes(pointerPosition);

               updateNodesIntersection();
            }
         })
         .on('end', (event: UseDragEvent) => {
            autoPanStarted = false;
            cancelAnimationFrame(autoPanId);

            if (dragItems) {
               const {
                  nodeInternals,
                  transform,
                  gridStep,
                  centerStep,
                  smoothStep,
                  updateNodesPosition,
                  updateNodesIntersection,
               } = getStore();

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
                     dragItems,
                     false,
                     updateNodePosition(pointerPosition, true),
                  );
                  updateNodesIntersection();
               } else {
                  updateNodesPosition(dragItems, false);
               }

               if (onDragEnd) {
                  const [currentNode, nodes] = getEventHandlerParams({
                     nodeId,
                     dragItems: dragItems,
                     nodeInternals,
                  });
                  onDragEnd(event.sourceEvent, dragItems, currentNode, nodes);
               }
            }
         })
         .filter((event: MouseEvent) => {
            const target = event.target as HTMLDivElement;

            if (!domNode) return false;

            const isDraggable =
               !event.button &&
               (!noDragClassName ||
                  !hasSelector(target, `.${noDragClassName}`, domNode));

            return isDraggable;
         });

      d3Selection.call(dragHandle);
   };
   const destroy = () => {
      d3Selection?.on('.drag', null);
   };

   return {
      update,
      destroy,
   };
};
