import { memo } from 'react';

import ZoomPane, { ZoomPaneProps } from '../ZoomPane';

type RequiredProps = ZoomPaneProps;

export type DiagramRendererProps = RequiredProps;

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
