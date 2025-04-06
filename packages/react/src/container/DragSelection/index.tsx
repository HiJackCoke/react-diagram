import { useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import {
   Rect,
   XYPosition,
   getEventPosition,
   getNodesInside,
   getRectOfNodes,
} from '@diagram/core';
import cc from 'classcat';

import { shallow } from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';

import DragBox from '../../components/DragBox';
import SelectionBox from '../../components/SelectionBox';

import { getSelectionChanges } from '../../utils/changes';

import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';
import { NodeChange } from '../../types';

type DragSelectionProps = {
   dragSelectionKeyPressed?: boolean;
   children: ReactNode;
};

const selector = (s: ReactDiagramState) => {
   const { elementsSelectable, transform, selectionBoxActive, getNodes } = s;
   const selectedNodes = getNodes().filter((n) => n.selected);

   return {
      elementsSelectable,
      selectionBoxRect: getRectOfNodes(selectedNodes, s.nodeOrigin),
      transformString: `translate(${transform[0]}px,${transform[1]}px) scale(${transform[2]})`,
      selectionBoxActive,
   };
};

function DragSelection({
   dragSelectionKeyPressed,
   children,
}: DragSelectionProps) {
   const store = useStoreApi();

   const dragSelection = useRef<HTMLDivElement>(null);
   const prevSelectedNodesCount = useRef<number>(0);

   const containerBounds = useRef<DOMRect>();

   const {
      elementsSelectable,
      selectionBoxRect,
      transformString,
      selectionBoxActive,
   } = useStore(selector, shallow);

   const [dragBoxStartPosition, setDragBoxStartPosition] = useState<XYPosition>(
      {
         x: 0,
         y: 0,
      },
   );
   const [dragBoxRect, setDragBoxRect] = useState<Rect>({
      width: 0,
      height: 0,
      x: 0,
      y: 0,
   });

   const [dragBoxActive, setDragBoxActive] = useState(false);

   useEffect(() => {
      if (!dragSelectionKeyPressed) {
         resetDragBox();
      }
   }, [dragSelectionKeyPressed]);

   const resetDragBox = () => {
      store.setState({
         selectionBoxActive: prevSelectedNodesCount.current > 0,
      });

      setDragBoxStartPosition({
         x: 0,
         y: 0,
      });
      setDragBoxRect({
         width: 0,
         height: 0,
         x: 0,
         y: 0,
      });
      setDragBoxActive(false);
   };

   const onClick = (e: ReactMouseEvent) => {
      if (e.target === dragSelection.current) {
         store.getState().resetSelectedElements();

         store.setState({
            selectionBoxActive: false,
         });
         setDragBoxActive(false);
      }
   };

   const onMouseDown = (event: ReactMouseEvent): void => {
      const { resetSelectedElements, domNode } = store.getState();
      containerBounds.current = domNode?.getBoundingClientRect();

      if (
         !elementsSelectable ||
         event.button !== 0 ||
         event.target !== dragSelection.current ||
         !containerBounds.current ||
         !dragSelectionKeyPressed
      ) {
         return;
      }

      const { x, y } = getEventPosition(
         event.nativeEvent,
         containerBounds.current,
      );

      resetSelectedElements();

      setDragBoxRect({
         width: 0,
         height: 0,
         x,
         y,
      });

      setDragBoxStartPosition({
         x,
         y,
      });
   };

   const onMouseMove = (event: ReactMouseEvent): void => {
      const { nodeInternals, transform, nodeOrigin, getNodes, onNodesChange } =
         store.getState();

      const hasDragBoxStartPosition =
         dragBoxStartPosition.x > 0 && dragBoxStartPosition.y > 0;

      if (
         // !hasDragBoxPosition ||
         !hasDragBoxStartPosition ||
         !containerBounds.current ||
         !dragSelectionKeyPressed
      ) {
         return;
      }

      store.setState({
         selectionBoxActive: false,
      });

      setDragBoxActive(true);

      const mousePos = getEventPosition(
         event.nativeEvent,
         containerBounds.current,
      );
      const startX = dragBoxStartPosition.x ?? 0;
      const startY = dragBoxStartPosition.y ?? 0;

      const rect = {
         x: mousePos.x < startX ? mousePos.x : startX,
         y: mousePos.y < startY ? mousePos.y : startY,
         width: Math.abs(mousePos.x - startX),
         height: Math.abs(mousePos.y - startY),
      };

      const nodes = getNodes();
      const selectedNodes = getNodesInside(
         nodeInternals,
         rect,
         transform,
         false,
         true,
         nodeOrigin,
      );

      const selectedNodeIds = selectedNodes.map((n) => n.id);

      if (prevSelectedNodesCount.current !== selectedNodeIds.length) {
         prevSelectedNodesCount.current = selectedNodeIds.length;

         const changes = getSelectionChanges(
            nodes,
            selectedNodeIds,
         ) as NodeChange[];

         if (changes.length) {
            onNodesChange?.(changes);
         }
      }

      setDragBoxRect(rect);
   };

   const onMouseUp = (event: ReactMouseEvent) => {
      if (event.button !== 0) {
         return;
      }

      resetDragBox();
   };

   const onMouseLeave = () => {
      resetDragBox();
   };

   const isPossibleDragSelection =
      elementsSelectable && dragSelectionKeyPressed;

   return (
      <div
         ref={dragSelection}
         className={cc([
            'react-diagram__container react-diagram__drag-selection',
         ])}
         onClick={onClick}
         onMouseDown={isPossibleDragSelection ? onMouseDown : undefined}
         onMouseMove={isPossibleDragSelection ? onMouseMove : undefined}
         onMouseUp={elementsSelectable ? onMouseUp : undefined}
         onMouseLeave={isPossibleDragSelection ? onMouseLeave : undefined}
      >
         {children}
         {dragBoxActive && <DragBox rect={dragBoxRect} />}
         {selectionBoxActive && (
            <SelectionBox rect={selectionBoxRect} transform={transformString} />
         )}
      </div>
   );
}

export default DragSelection;
