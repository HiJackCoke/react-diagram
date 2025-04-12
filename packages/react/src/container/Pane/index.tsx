import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import cc from 'classcat';

import { useStoreApi } from '../../hooks/useStore';

import { CosmosPanZoom, PanZoomInstance, Transform } from 'cosmos-diagram';
import { ReactDiagramProps } from '../../types';
// import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';

export type PaneProps = Required<
   Pick<
      ReactDiagramProps,
      | 'noPanClassName'
      | 'panning'
      | 'minZoom'
      | 'maxZoom'
      | 'defaultViewport'
      | 'translateExtent'
   > & {
      children: ReactNode;
      selection: boolean;
   }
> &
   Pick<ReactDiagramProps, 'onMove' | 'onMoveStart' | 'onMoveEnd'>;

const Pane = ({
   noPanClassName,
   panning,
   selection,
   minZoom,
   maxZoom,
   defaultViewport,
   translateExtent,
   children,

   onMove,
   onMoveStart,
   onMoveEnd,
}: PaneProps) => {
   const store = useStoreApi();

   const Pane = useRef<HTMLDivElement>(null);
   const cosmosPanZoom = useRef<PanZoomInstance>();

   useEffect(() => {
      if (!Pane.current) return;

      cosmosPanZoom.current = CosmosPanZoom({
         domNode: Pane.current,
         minZoom,
         maxZoom,
         translateExtent,
         viewport: defaultViewport,
         panning,
         onTransformChange: (transform: Transform) => {
            store.setState({ transform });
         },
         onPanningChange: (panning: boolean) => {
            console.log(panning);
         },
         onPanZoomStart: (event, viewport) => {
            onMoveStart?.(event, viewport);
            console.log('start', viewport);
         },
         onPanZoom: (event, viewport) => {
            onMove?.(event, viewport);
         },
         onPanZoomEnd: (event, viewport) => {
            console.log('end', viewport);
            onMoveEnd?.(event, viewport);
         },
      });

      const { x, y, zoom } = cosmosPanZoom.current.getViewport();

      store.setState({
         // 지워야할 목록
         // d3Zoom: d3ZoomInstance,
         // d3Selection: selection,

         // we need to pass transform because zoom handler is not registered when we set the initial transform
         transform: [x, y, zoom],
         domNode: Pane.current.closest('.react-diagram') as HTMLDivElement,
      });

      return () => {
         cosmosPanZoom.current?.destroy();
      };
   }, []);

   useEffect(() => {
      cosmosPanZoom.current?.update({
         noPanClassName,
         selection,
      });
   }, [noPanClassName, selection]);

   return (
      <div
         ref={Pane}
         className={cc([
            'react-diagram__pane react-diagram__container',
            { selection },
         ])}
      >
         {children}
      </div>
   );
};

export default Pane;
