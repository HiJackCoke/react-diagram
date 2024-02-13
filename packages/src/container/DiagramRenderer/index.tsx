import { memo, useState, useEffect } from 'react';

import { useStore } from '../../hooks/useStore';
import useGlobalKeyHandler, { KeyCode } from '../../hooks/useGlobalKeyHandler';

import Pane from '../Pane';
import Viewport from '../../container/Viewport';

import { PaneProps } from '../Pane';
import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';
import DragSelection from '../DragSelection';

export type DiagramRendererProps = Omit<
   PaneProps,
   'translateExtent' | 'minZoom' | 'maxZoom'
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

   const [dragSelectionKeyPressed, setDragSelectionKeyPressed] =
      useState(false);

   useGlobalKeyHandler(multiSelectionKeyCode);

   const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === dragSelectionKeyCode) {
         setDragSelectionKeyPressed(true);
      }
   };

   const handleKeyUp = () => {
      setDragSelectionKeyPressed(false);
   };

   useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      return () => {
         document.removeEventListener('keydown', handleKeyDown);
         document.removeEventListener('keyup', handleKeyUp);
      };
   }, []);

   return (
      <Pane
         noPanClassName={noPanClassName}
         panning={panning && !dragSelectionKeyPressed}
         minZoom={minZoom}
         maxZoom={maxZoom}
         translateExtent={translateExtent}
         defaultViewport={defaultViewport}
         onMove={onMove}
         onMoveStart={onMoveStart}
         onMoveEnd={onMoveEnd}
      >
         <DragSelection dragSelectionKeyPressed={dragSelectionKeyPressed}>
            <Viewport>{children}</Viewport>
         </DragSelection>
      </Pane>
   );
}

DiagramRenderer.displayName = 'DiagramRenderer';

export default memo(DiagramRenderer);
