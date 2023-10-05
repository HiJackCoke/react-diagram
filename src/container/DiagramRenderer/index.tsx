import { memo } from 'react';

import { useStore } from 'hooks/useStore';
import useGlobalKeyHandler from 'hooks/useGlobalKeyHandler';

import ZoomPane from 'container/ZoomPane';
import Viewport from 'container/Viewport';

import { ZoomPaneProps } from 'container/ZoomPane';
import { ReactDiagramState } from 'types';

export type DiagramRendererProps = Omit<ZoomPaneProps, 'translateExtent'>;

const selector = (s: ReactDiagramState) => s.translateExtent;

function DiagramRenderer({
   children,
   noPanClassName,
   panning,
   minZoom,
   maxZoom,

   defaultViewport,
   onMove,
   onMoveStart,
   onMoveEnd,
}: DiagramRendererProps) {
   const translateExtent = useStore(selector);

   useGlobalKeyHandler();

   return (
      <ZoomPane
         noPanClassName={noPanClassName}
         panning={panning}
         minZoom={minZoom}
         maxZoom={maxZoom}
         translateExtent={translateExtent}
         defaultViewport={defaultViewport}
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
