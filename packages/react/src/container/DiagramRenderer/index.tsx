import { memo } from 'react';

import { useStore } from '../../hooks/useStore';
import useGlobalKeyHandler from '../../hooks/useGlobalKeyHandler';

import Pane from '../Pane';
import Viewport from '../../container/Viewport';

import { PaneProps } from '../Pane';
import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';
import DragSelection from '../DragSelection';
// import useDragSelectionKeyPress from '../../hooks/useDragSelectionKeyPress';
import useKeyPress from '../../hooks/useKeyPress';
import { ReactDiagramProps } from '../../types';

export type DiagramRendererProps = Omit<
   PaneProps,
   'translateExtent' | 'minZoom' | 'maxZoom' | 'selection'
> &
   Pick<
      ReactDiagramProps,
      'dragSelectionKeyCode' | 'multiSelectionKeyCode' | 'deleteKeyCode'
   >;

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
   deleteKeyCode,
   noPanClassName,
   panning,
   defaultViewport,
   onMove,
   onMoveStart,
   onMoveEnd,
   onPaneClick,
   onPaneMouseEnter,
   onPaneMouseMove,
   onPaneMouseLeave,
}: DiagramRendererProps) {
   useGlobalKeyHandler({ multiSelectionKeyCode, deleteKeyCode });

   const { minZoom, maxZoom, translateExtent } = useStore(selector);

   const dragSelectionKeyPressed = useKeyPress(dragSelectionKeyCode || 'Shift');

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
            onPaneClick={onPaneClick}
            onPaneMouseEnter={onPaneMouseEnter}
            onPaneMouseMove={onPaneMouseMove}
            onPaneMouseLeave={onPaneMouseLeave}
         >
            <DragSelection isSelecting={isSelecting}>
               <Viewport>{children}</Viewport>
            </DragSelection>
         </Pane>
      </>
   );
}

DiagramRenderer.displayName = 'DiagramRenderer';

export default memo(DiagramRenderer);
