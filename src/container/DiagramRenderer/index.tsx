import { memo } from 'react';

import ZoomPane from '../ZoomPane';

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
      {children}
   </ZoomPane>
);

DiagramRenderer.displayName = 'DiagramRenderer';

export default memo(DiagramRenderer);
