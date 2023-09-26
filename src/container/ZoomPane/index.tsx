import { useEffect, useRef } from 'react';
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react';

import { ZoomTransform } from 'd3';
import { zoom, zoomIdentity } from 'd3-zoom';
import type { D3ZoomEvent } from 'd3-zoom';
import { select } from 'd3-selection';

import { shallow } from 'zustand/shallow';

import { useStore, useStoreApi } from 'hooks/useStore';

import { clamp } from 'utils';

import { ReactDiagramProps, CoordinateExtent, Viewport } from 'types';
import { ReactDiagramState } from 'components/ReactDiagramProvider/type';

import './style.css';

export type ZoomPaneProps = Required<
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

function ZoomPane({
   noPanClassName,
   panning,
   minZoom,
   maxZoom,
   defaultViewport,
   translateExtent,
   children,
   onMove,
   onMoveStart,
   onMoveEnd,
}: ZoomPaneProps) {
   const store = useStoreApi();
   const isZoomingOrPanning = useRef(false);

   const zoomPane = useRef<HTMLDivElement>(null);
   const d3ZoomHandler =
      useRef<(this: Element, event: any, d: unknown) => void | undefined>();
   const prevTransform = useRef<Viewport>({ x: 0, y: 0, zoom: 0 });
   const timerId = useRef<ReturnType<typeof setTimeout>>();

   const { d3Zoom, d3Selection } = useStore(selector, shallow);

   const onClick = (e: ReactMouseEvent) => {
      if (e.target === zoomPane.current) {
         store.getState().resetSelectedElements();
      }
   };

   useEffect(() => {
      if (zoomPane.current) {
         const bbox = zoomPane.current.getBoundingClientRect();
         const d3ZoomInstance = zoom()
            .scaleExtent([minZoom, maxZoom])
            .translateExtent(translateExtent);
         const selection = select(zoomPane.current as Element).call(
            d3ZoomInstance,
         );
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
            domNode: zoomPane.current.closest(
               '.react-diagram',
            ) as HTMLDivElement,
         });
      }
   }, []);

   useEffect(() => {
      if (d3Zoom && d3Selection) {
         d3Selection.on('wheel.zoom', (event) => {
            event.preventDefault();

            if (d3ZoomHandler.current) {
               d3ZoomHandler.current.call(zoomPane.current, event);
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

            return true;
         });
      }
   }, [d3Zoom, panning]);

   return (
      <div
         className="react-diagram__zoompane react-diagram__container"
         ref={zoomPane}
         onClick={onClick}
      >
         {children}
      </div>
   );
}

export default ZoomPane;
