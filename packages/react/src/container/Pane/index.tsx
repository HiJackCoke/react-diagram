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
   Pick<
      ReactDiagramProps,
      | 'onMove'
      | 'onMoveStart'
      | 'onMoveEnd'
      | 'onPaneClick'
      | 'onPaneMouseEnter'
      | 'onPaneMouseMove'
      | 'onPaneMouseLeave'
   >;

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
   onPaneClick,
   onPaneMouseEnter,
   onPaneMouseMove,
   onPaneMouseLeave,
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
         onPaneClick,
         onPanZoomStart: onMoveStart,
         onPanZoom: onMove,
         onPanZoomEnd: onMoveEnd,
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

   //onPaneMouseEnter
   //onPaneMouseMove
   //onPaneMouseLeave

   return (
      <div
         ref={Pane}
         className={cc([
            'react-diagram__pane react-diagram__container',
            { selection },
         ])}
         onMouseEnter={onPaneMouseEnter}
         onMouseMove={onPaneMouseMove}
         onMouseLeave={onPaneMouseLeave}
      >
         {children}
      </div>
   );
};

export default Pane;
