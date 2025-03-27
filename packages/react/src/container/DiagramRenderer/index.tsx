import { memo } from 'react';

import { useStore } from '../../hooks/useStore';
import useGlobalKeyHandler, { KeyCode } from '../../hooks/useGlobalKeyHandler';

import Pane from '../Pane';
import Viewport from '../../container/Viewport';

import { PaneProps } from '../Pane';
import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';
import DragSelection from '../DragSelection';
import useDragSelectionKeyPress from '../../hooks/useDragSelectionKeyPress';

export type DiagramRendererProps = Omit<
   PaneProps,
   'translateExtent' | 'minZoom' | 'maxZoom' | 'selection'
> & {
   multiSelectionKeyCode?: KeyCode;
   dragSelectionKeyCode?: KeyCode;
};

const selector = (s: ReactDiagramState) => {
   const { minZoom, maxZoom, translateExtent } = s;
   return {
      minZoom,
      maxZoom,
      translateExtent,
   };
};

function DiagramRenderer({
   children,
   multiSelectionKeyCode,
   dragSelectionKeyCode,
   noPanClassName,
   panning,
   defaultViewport,
   onMove,
   onMoveStart,
   onMoveEnd,
}: DiagramRendererProps) {
   const { minZoom, maxZoom, translateExtent } = useStore(selector);

   useGlobalKeyHandler(multiSelectionKeyCode);

   const dragSelectionKeyPressed =
      useDragSelectionKeyPress(dragSelectionKeyCode);

   // useKeyPress
   const isSelecting = dragSelectionKeyPressed;
   const isPanning = panning && !isSelecting;

   return (
      <>
         <Pane
            noPanClassName={noPanClassName}
            panning={isPanning}
            selection={isSelecting}
            minZoom={minZoom}
            maxZoom={maxZoom}
            translateExtent={translateExtent}
            defaultViewport={defaultViewport}
            onMove={onMove}
            onMoveStart={onMoveStart}
            onMoveEnd={onMoveEnd}
         >
            <Viewport>{children}</Viewport>
         </Pane>

         <DragSelection dragSelectionKeyPressed={dragSelectionKeyPressed} />
      </>
   );
}

DiagramRenderer.displayName = 'DiagramRenderer';

export default memo(DiagramRenderer);
