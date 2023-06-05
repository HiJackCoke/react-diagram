import { ReactNode } from 'react';
import { ReactDiagramProps } from 'types';

export type ZoomPaneProps = Required<
   Pick<
      ReactDiagramProps,
      'minZoom' | 'maxZoom' | 'defaultViewport' | 'translateExtent'
   > & {
      children: ReactNode;
   }
>;
