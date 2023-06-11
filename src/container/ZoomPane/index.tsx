import { useEffect, useRef } from 'react';
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react';

import { zoom, zoomIdentity } from 'd3-zoom';
import type { D3ZoomEvent } from 'd3-zoom';
import { select } from 'd3-selection';

import { shallow } from 'zustand/shallow';

import { useStore, useStoreApi } from 'hooks/useStore';

import { clamp } from 'utils';

import { ReactDiagramProps, CoordinateExtent } from 'types';
import { ReactDiagramState } from 'components/ReactDiagramProvider/type';

import { containerStyle } from 'container/style';
import './style.css';

export type ZoomPaneProps = Required<
   Pick<
      ReactDiagramProps,
      'minZoom' | 'maxZoom' | 'defaultViewport' | 'translateExtent'
   > & {
      children: ReactNode;
   }
>;

const selector = (s: ReactDiagramState) => ({
   d3Zoom: s.d3Zoom,
});

const ZoomPane = ({
   minZoom,
   maxZoom,
   defaultViewport,
   translateExtent,
   children,
}: ZoomPaneProps) => {
   const store = useStoreApi();
   const isZoomingOrPanning = useRef(false);

   const zoomPane = useRef<HTMLDivElement>(null);

   const { d3Zoom } = useStore(selector, shallow);

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

         store.setState({
            d3Zoom: d3ZoomInstance,

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
      if (d3Zoom) {
         d3Zoom.on('start', (event: D3ZoomEvent<HTMLDivElement, any>) => {
            console.log(event);
            isZoomingOrPanning.current = true;
         });
      }
   }, [d3Zoom]);

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
         });
      }
   }, [d3Zoom]);

   useEffect(() => {
      if (d3Zoom) {
         d3Zoom.on('end', (event: D3ZoomEvent<HTMLDivElement, any>) => {
            console.log(event);
            isZoomingOrPanning.current = false;
         });
      }
   }, [d3Zoom]);

   const onClick = (e: ReactMouseEvent) => {
      if (e.target === zoomPane.current) {
         store.getState().resetSelectedElements();
      }
   };

   return (
      <div
         className="react-diagram__zoompane"
         ref={zoomPane}
         style={containerStyle}
         onClick={onClick}
      >
         {children}
      </div>
   );
};

export default ZoomPane;
