import { memo } from 'react';
import type { ReactNode } from 'react';

import ZoomPane from '../ZoomPane';

import { ReactDiagramProps } from '../../types';

type RequiredProps = Required<
   Pick<
      ReactDiagramProps,
      'minZoom' | 'maxZoom' | 'defaultViewport' | 'translateExtent'
   >
>;

export type DiagramRendererProps = RequiredProps & { children: ReactNode };

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
