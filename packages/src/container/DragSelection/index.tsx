import { useRef, useState } from 'react';
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react';

import { shallow } from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';

import DragBox from '../../components/DragBox';
import SelectionBox from '../../components/SelectionBox';

import { getEventPosition } from '../../utils';
import { getNodesInside, getRectOfNodes } from '../../utils/graph';

import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';

import { Rect, XYPosition } from '../../types';

type DragSelectionProps = {
   children: ReactNode;
   dragSelectionKeyPressed?: boolean;
};

const selector = (s: ReactDiagramState) => {
   return {
      elementsSelectable: s.elementsSelectable,
      transform: `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`,
   };
};

function DragSelection({
   children,
   dragSelectionKeyPressed,
}: DragSelectionProps) {
   const store = useStoreApi();

   const dragSelection = useRef<HTMLDivElement>(null);
   const prevSelectedNodesCount = useRef<number>(0);

   const containerBounds = useRef<DOMRect>();

   const { elementsSelectable, transform } = useStore(selector, shallow);

   const [dragBoxStartPosition, setDragBoxStartPosition] =
      useState<XYPosition | null>({
         x: 0,
         y: 0,
      });
   const [dragBoxRect, setDragBoxRect] = useState<Rect | null>({
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

   const [dragBoxActive, setDragBoxActive] = useState(false);
   const [selectionBoxActive, setSelectionBoxActive] = useState(false);

   const resetDragBox = () => {
      setDragBoxRect(null);
      setDragBoxStartPosition(null);
      setDragBoxActive(false);
   };

   const onClick = (e: ReactMouseEvent) => {
      if (e.target === dragSelection.current) {
         store.getState().resetSelectedElements();
         setDragBoxActive(false);
         setSelectionBoxActive(false);
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
      const { nodeInternals, transform, nodeOrigin } = store.getState();

      if (
         !dragBoxRect ||
         !dragBoxStartPosition ||
         !containerBounds.current ||
         !dragSelectionKeyPressed
      ) {
         return;
      }

      setDragBoxActive(true);
      setSelectionBoxActive(false);

      const mousePos = getEventPosition(event, containerBounds.current);
      const startX = dragBoxStartPosition.x ?? 0;
      const startY = dragBoxStartPosition.y ?? 0;

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

      setDragBoxRect(rect);
   };

   const onMouseUp = (event: ReactMouseEvent) => {
      if (event.button !== 0) {
         return;
      }

      setSelectionBoxActive(prevSelectedNodesCount.current > 0);
      resetDragBox();
   };

   const onMouseLeave = () => {
      setSelectionBoxActive(prevSelectedNodesCount.current > 0);
      resetDragBox();
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
         onMouseUp={elementsSelectable && dragBoxRect ? onMouseUp : undefined}
         onMouseLeave={isPossibleDragSelection ? onMouseLeave : undefined}
      >
         {children}
         {dragBoxActive && dragBoxRect && <DragBox rect={dragBoxRect} />}
         {selectionBoxActive && (
            <SelectionBox rect={selectionBoxRect} transform={transform} />
         )}
      </div>
   );
}

export default DragSelection;
