import { memo } from 'react';

import useGlobalKeyHandler from 'hooks/useGlobalKeyHandler';

import ZoomPane from 'container/ZoomPane';
import Viewport from 'container/Viewport';

import { ZoomPaneProps } from 'container/ZoomPane';

type RequiredProps = ZoomPaneProps;

export type DiagramRendererProps = RequiredProps;

function DiagramRenderer({
   children,

   noPanClassName,
   panning,
   minZoom,
   maxZoom,
   translateExtent,
   defaultViewport,
}: DiagramRendererProps) {
   useGlobalKeyHandler();

   return (
      <ZoomPane
         noPanClassName={noPanClassName}
         panning={panning}
         minZoom={minZoom}
         maxZoom={maxZoom}
         translateExtent={translateExtent}
         defaultViewport={defaultViewport}
      >
         <Viewport>{children}</Viewport>
      </ZoomPane>
   );
}

DiagramRenderer.displayName = 'DiagramRenderer';

export default memo(DiagramRenderer);
