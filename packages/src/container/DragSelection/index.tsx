import { useRef, useState } from 'react';
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react';

import { shallow } from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';

import { getEventPosition } from '../../utils';

import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';
import DragBox, { DragBoxRect } from '../../components/DragBox';

export type DragSelectionProps = {
   children: ReactNode;
   dragSelectionKeyPressed?: boolean;
};
const selector = (s: ReactDiagramState) => ({
   elementsSelectable: s.elementsSelectable,
});

function DragSelection({
   children,
   dragSelectionKeyPressed,
}: DragSelectionProps) {
   const store = useStoreApi();

   const dragSelection = useRef<HTMLDivElement>(null);

   const containerBounds = useRef<DOMRect>();

   const { elementsSelectable } = useStore(selector, shallow);

   const [dragSelectionRect, setDragSelectionRect] =
      useState<DragBoxRect | null>({
         width: 0,
         height: 0,
         startX: 0,
         startY: 0,
         x: 0,
         y: 0,
      });

   const onClick = (e: ReactMouseEvent) => {
      if (e.target === dragSelection.current) {
         store.getState().resetSelectedElements();
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

      const { x, y } = getEventPosition(event, containerBounds.current);

      resetSelectedElements();

      setDragSelectionRect({
         width: 0,
         height: 0,
         startX: x,
         startY: y,
         x,
         y,
      });
   };

   const onMouseMove = (event: ReactMouseEvent): void => {
      if (
         !dragSelectionRect ||
         !containerBounds.current ||
         !dragSelectionKeyPressed
      )
         return;

      const mousePos = getEventPosition(event, containerBounds.current);
      const startX = dragSelectionRect.startX ?? 0;
      const startY = dragSelectionRect.startY ?? 0;

      const rect = {
         ...dragSelectionRect,
         x: mousePos.x < startX ? mousePos.x : startX,
         y: mousePos.y < startY ? mousePos.y : startY,
         width: Math.abs(mousePos.x - startX),
         height: Math.abs(mousePos.y - startY),
      };

      setDragSelectionRect(rect);
   };

   const onMouseUp = (event: ReactMouseEvent) => {
      if (event.button !== 0) {
         return;
      }

      setDragSelectionRect(null);
   };

   const onMouseLeave = () => {
      setDragSelectionRect(null);
   };

   const isPossibleDragSelection =
      elementsSelectable && dragSelectionKeyPressed;

   return (
      <div
         ref={dragSelection}
         className="react-diagram__container react-diagram__drag-selection "
         onClick={onClick}
         onMouseDown={isPossibleDragSelection ? onMouseDown : undefined}
         onMouseMove={isPossibleDragSelection ? onMouseMove : undefined}
         onMouseUp={
            elementsSelectable && dragSelectionRect ? onMouseUp : undefined
         }
         onMouseLeave={isPossibleDragSelection ? onMouseLeave : undefined}
      >
         {children}
         <DragBox rect={dragSelectionRect} />
      </div>
   );
}

export default DragSelection;
