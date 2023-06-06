import { memo } from 'react';

import ZoomPane from 'container/ZoomPane';
import Viewport from 'container/Viewport';

import { DiagramRendererProps } from './type';

const DiagramRenderer = ({
   children,

   defaultViewport,
   translateExtent,
   minZoom,
   maxZoom,
}: DiagramRendererProps) => (
   <ZoomPane
      minZoom={minZoom}
      maxZoom={maxZoom}
      translateExtent={translateExtent}
      defaultViewport={defaultViewport}
   >
      <Viewport>{children}</Viewport>
   </ZoomPane>
);

DiagramRenderer.displayName = 'DiagramRenderer';

export default memo(DiagramRenderer);
