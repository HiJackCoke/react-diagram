import { memo } from 'react';

import useGlobalKeyHandler from 'hooks/useGlobalKeyHandler';

import ZoomPane from 'container/ZoomPane';
import Viewport from 'container/Viewport';

import { DiagramRendererProps } from './type';

function DiagramRenderer({
   children,

   noPanClassName,
   defaultViewport,
   translateExtent,
   minZoom,
   maxZoom,
}: DiagramRendererProps) {
   useGlobalKeyHandler();

   return (
      <ZoomPane
         noPanClassName={noPanClassName}
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
