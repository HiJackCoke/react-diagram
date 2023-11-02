import { memo, useState, useEffect } from 'react';

import { useStore } from '../../hooks/useStore';
import useGlobalKeyHandler, { KeyCode } from '../../hooks/useGlobalKeyHandler';

import ZoomPane from '../../container/ZoomPane';
import Viewport from '../../container/Viewport';

import { ZoomPaneProps } from '../../container/ZoomPane';
import { ReactDiagramState } from '../../types';

export type DiagramRendererProps = Omit<
   ZoomPaneProps,
   'translateExtent' | 'minZoom' | 'maxZoom'
> & {
   multiSelectionKeyCode?: KeyCode;
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
      if (e.key === 'Shift') {
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
      <ZoomPane
         noPanClassName={noPanClassName}
         panning={panning}
         minZoom={minZoom}
         maxZoom={maxZoom}
         translateExtent={translateExtent}
         defaultViewport={defaultViewport}
         dragSelectionKeyPressed={dragSelectionKeyPressed}
         onMove={onMove}
         onMoveStart={onMoveStart}
         onMoveEnd={onMoveEnd}
      >
         <Viewport>{children}</Viewport>
      </ZoomPane>
   );
}

DiagramRenderer.displayName = 'DiagramRenderer';

export default memo(DiagramRenderer);
