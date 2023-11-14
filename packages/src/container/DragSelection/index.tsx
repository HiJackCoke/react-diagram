import { useRef, useState } from 'react';
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react';

import { shallow } from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';

import DragBox from '../../components/DragBox';
import SelectionBox from '../../components/SelectionBox';

import { getEventPosition } from '../../utils';
import { getNodesInside, getRectOfNodes } from '../../utils/graph';

import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';

import { Rect } from '../../types';

type DragSelectionProps = {
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
   const [selectionBoxActive, setSelectionBoxActive] = useState(false);
   const prevSelectedNodesCount = useRef<number>(0);

   const containerBounds = useRef<DOMRect>();

   const { elementsSelectable } = useStore(selector, shallow);

   const [dragSelectionRect, setDragSelectionRect] = useState<Rect | null>({
      width: 0,
      height: 0,
      x: 0,
      y: 0,
   });

   const [selectionBoxRect, setSelectionBoxRect] = useState<Rect>({
      width: 0,
      height: 0,
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
         x,
         y,
      });
   };

   const onMouseMove = (event: ReactMouseEvent): void => {
      const { nodeInternals, transform, nodeOrigin } = store.getState();

      if (
         !dragSelectionRect ||
         !containerBounds.current ||
         !dragSelectionKeyPressed
      )
         return;

      const mousePos = getEventPosition(event, containerBounds.current);
      const startX = dragSelectionRect.x ?? 0;
      const startY = dragSelectionRect.y ?? 0;

      const rect = {
         x: mousePos.x < startX ? mousePos.x : startX,
         y: mousePos.y < startY ? mousePos.y : startY,
         width: Math.abs(mousePos.x - startX),
         height: Math.abs(mousePos.y - startY),
      };

      const selectedNodes = getNodesInside(
         nodeInternals,
         rect,
         transform,
         false,
         true,
         nodeOrigin,
      );

      const selectedNodeIds = selectedNodes.map((n) => n.id);

      const selectionBoxRect = getRectOfNodes(selectedNodes, nodeOrigin);
      setSelectionBoxRect(selectionBoxRect);

      if (prevSelectedNodesCount.current !== selectedNodeIds.length) {
         prevSelectedNodesCount.current = selectedNodeIds.length;
      }

      setDragSelectionRect(rect);
   };

   const onMouseUp = (event: ReactMouseEvent) => {
      if (event.button !== 0) {
         return;
      }

      if (
         selectionBoxRect &&
         selectionBoxRect?.width &&
         selectionBoxRect.height
      )
         setSelectionBoxActive(true);
      else setSelectionBoxActive(false);
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
         className="react-diagram__container react-diagram__drag-selection"
         onClick={onClick}
         onMouseDown={isPossibleDragSelection ? onMouseDown : undefined}
         onMouseMove={isPossibleDragSelection ? onMouseMove : undefined}
         onMouseUp={
            elementsSelectable && dragSelectionRect ? onMouseUp : undefined
         }
         onMouseLeave={isPossibleDragSelection ? onMouseLeave : undefined}
      >
         {children}
         {dragSelectionRect && <DragBox rect={dragSelectionRect} />}
         {selectionBoxActive && <SelectionBox rect={selectionBoxRect} />}
      </div>
   );
}

export default DragSelection;
