import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import cc from 'classcat';
import { ZoomTransform } from 'd3';
import { zoom, zoomIdentity } from 'd3-zoom';
import type { D3ZoomEvent } from 'd3-zoom';
import { select } from 'd3-selection';

import { shallow } from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';

import { CoordinateExtent, Viewport, clamp } from '@diagram/core';
import { ReactDiagramProps,  } from '../../types';
import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';

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

const convertTransform = (transform: ZoomTransform): Viewport => {
   const { x, y, k } = transform;
   return {
      x,
      y,
      zoom: k,
   };
};

const isWrappedWithClass = (event: any, className: string | undefined) =>
   event.target.closest(`.${className}`);

const isViewChanged = (
   prevViewport: Viewport,
   eventViewport: ZoomTransform,
): boolean => {
   const { x: prevX, y: prevY, zoom: prevZoom } = prevViewport;
   const { x, y, k } = eventViewport;
   return prevX !== x || prevY !== y || prevZoom !== k;
};

const selector = (s: ReactDiagramState) => ({
   d3Zoom: s.d3Zoom,
   d3Selection: s.d3Selection,
});

function Pane({
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
}: PaneProps) {
   const store = useStoreApi();
   const isZoomingOrPanning = useRef(false);
   const Pane = useRef<HTMLDivElement>(null);
   const d3ZoomHandler =
      useRef<(this: Element, event: any, d: unknown) => void | undefined>();
   const prevTransform = useRef<Viewport>({ x: 0, y: 0, zoom: 0 });
   const timerId = useRef<ReturnType<typeof setTimeout>>();

   const { d3Zoom, d3Selection } = useStore(selector, shallow);

   useEffect(() => {
      if (Pane.current) {
         const bbox = Pane.current.getBoundingClientRect();
         const d3ZoomInstance = zoom()
            .scaleExtent([minZoom, maxZoom])
            .translateExtent(translateExtent);
         const selection = select(Pane.current as Element).call(d3ZoomInstance);
         const updatedTransform = zoomIdentity
            .translate(defaultViewport.x, defaultViewport.y)
            .scale(clamp(defaultViewport.zoom, minZoom, maxZoom));
         const extent: CoordinateExtent = [
            [0, 0],
            [bbox.width, bbox.height],
         ];

         const constrainedTransform = d3ZoomInstance.constrain()(
            updatedTransform,
            extent,
            translateExtent,
         );
         d3ZoomInstance.transform(selection, constrainedTransform);

         d3ZoomHandler.current = selection.on('wheel.zoom');
         store.setState({
            d3Zoom: d3ZoomInstance,
            d3Selection: selection,

            // we need to pass transform because zoom handler is not registered when we set the initial transform
            transform: [
               constrainedTransform.x,
               constrainedTransform.y,
               constrainedTransform.k,
            ],
            domNode: Pane.current.closest('.react-diagram') as HTMLDivElement,
         });
      }
   }, [translateExtent]);

   useEffect(() => {
      if (d3Zoom && d3Selection) {
         d3Selection.on('wheel.zoom', (event, d) => {
            event.preventDefault();

            if (Pane.current && d3ZoomHandler.current) {
               d3ZoomHandler.current.call(Pane.current, event, d);
            }
         });
      }
   }, [d3Zoom, d3Selection, d3ZoomHandler, panning]);

   useEffect(() => {
      if (d3Zoom) {
         d3Zoom.on('start', (event: D3ZoomEvent<HTMLDivElement, any>) => {
            if (!event.sourceEvent) {
               return null;
            }

            isZoomingOrPanning.current = true;

            if (onMoveStart) {
               const flowTransform = convertTransform(event.transform);
               prevTransform.current = flowTransform;

               onMoveStart?.(
                  event.sourceEvent as MouseEvent | TouchEvent,
                  flowTransform,
               );
            }
         });
      }
   }, [d3Zoom, onMoveStart]);

   useEffect(() => {
      if (d3Zoom) {
         d3Zoom.on('zoom', (event: D3ZoomEvent<HTMLDivElement, any>) => {
            store.setState({
               transform: [
                  event.transform.x,
                  event.transform.y,
                  event.transform.k,
               ],
            });

            if (onMove) {
               const flowTransform = convertTransform(event.transform);

               onMove?.(
                  event.sourceEvent as MouseEvent | TouchEvent,
                  flowTransform,
               );
            }
         });
      }
   }, [d3Zoom, onMove]);

   useEffect(() => {
      if (d3Zoom) {
         d3Zoom.on('end', (event: D3ZoomEvent<HTMLDivElement, any>) => {
            isZoomingOrPanning.current = false;

            if (
               onMoveEnd &&
               isViewChanged(prevTransform.current, event.transform)
            ) {
               const flowTransform = convertTransform(event.transform);
               prevTransform.current = flowTransform;

               clearTimeout(timerId.current);
               timerId.current = setTimeout(() => {
                  onMoveEnd?.(
                     event.sourceEvent as MouseEvent | TouchEvent,
                     flowTransform,
                  );
               }, 0);
            }
         });
      }
   }, [d3Zoom]);

   useEffect(() => {
      if (d3Zoom) {
         d3Zoom.filter((event: any) => {
            if (
               isWrappedWithClass(event, noPanClassName) &&
               event.type !== 'wheel'
            ) {
               return false;
            }

            if (!panning) return false;

            const buttonAllowed = !event.button || event.button <= 1;

            if (!buttonAllowed) return false;

            return true;
         });
      }
   }, [d3Zoom, panning]);

   return (
      <div
         className={cc([
            'react-diagram__pane react-diagram__container',
            { selection },
         ])}
         ref={Pane}
      >
         {children}
      </div>
   );
}

export default Pane;
