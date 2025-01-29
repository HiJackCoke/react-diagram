import { ZoomTransform } from 'd3';
import { zoom, zoomTransform } from 'd3-zoom';

import { select } from 'd3-selection';

import { clamp } from '../utils';

import {
   CoordinateExtent,
   Viewport,
   PanZoomParams,
   PanZoomTransformOptions,
   PanZoomUpdateOptions,
   PanZoomInstance,
} from '../types';
import {
   getD3Transition,
   isWrappedWithClass,
   viewportToTransform,
} from './utils';
import {
   ZoomPanValues,
   createPanZoomEndHandler,
   createPanZoomHandler,
   createPanZoomStartHandler,
   createZoomOnScrollHandler,
} from './eventHandler';

export const CosmosPanZoom = ({
   domNode,
   panning,
   // selection,
   minZoom,
   maxZoom,
   viewport,
   translateExtent,
   // children,

   onTransformChange,
   onPanningChange,
   onPanZoom,
   onPanZoomStart,
   onPanZoomEnd,
}: PanZoomParams): PanZoomInstance => {
   const zoomPanValues: ZoomPanValues = {
      isZoomingOrPanning: false,
      timerId: undefined,
      prevViewport: { x: 0, y: 0, zoom: 0 },
      // usedRightMouseButton: false,
      mouseButton: 0,
      // panScrollTimeout: undefined,
      isPanScrolling: false,
   };

   const bbox = domNode.getBoundingClientRect();

   const d3ZoomInstance = zoom()
      .scaleExtent([minZoom, maxZoom])
      .translateExtent(translateExtent);
   const d3Selection = select(domNode).call(d3ZoomInstance);

   const d3ZoomHandler = d3Selection.on('wheel.zoom')!;

   const setTransform = (
      transform: ZoomTransform,
      options?: PanZoomTransformOptions,
   ) => {
      if (d3Selection) {
         d3ZoomInstance?.transform(
            getD3Transition(d3Selection, options?.duration),
            transform,
         );
      }
   };

   const setViewportConstrained = (
      viewport: Viewport,
      extent: CoordinateExtent,
      translateExtent: CoordinateExtent,
   ) => {
      const updatedTransform = viewportToTransform(viewport);

      const constrainedTransform = d3ZoomInstance.constrain()(
         updatedTransform,
         extent,
         translateExtent,
      );

      if (constrainedTransform) {
         setTransform(constrainedTransform);
      }

      return constrainedTransform;
   };

   setViewportConstrained(
      {
         x: viewport.x,
         y: viewport.y,
         zoom: clamp(viewport.zoom, minZoom, maxZoom),
      },
      [
         [0, 0],
         [bbox.width, bbox.height],
      ],
      translateExtent,
   );

   const destroy = () => {
      d3ZoomInstance.on('zoom', null);
      // d3ZoomInstance.on('start', null);
      // d3ZoomInstance.on('end', null);
      // d3Selection.on('wheel.zoom', null);
   };

   const update = ({ noPanClassName, selection }: PanZoomUpdateOptions) => {
      if (selection && !zoomPanValues.isZoomingOrPanning) {
         destroy();
      }

      const filter = (event: any) => {
         if (selection) {
            return false;
         }

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
      };

      const wheelZoomHandler = createZoomOnScrollHandler({ d3ZoomHandler });
      d3Selection.on('wheel.zoom', wheelZoomHandler, { passive: false });

      if (!selection) {
         const panZoomStartHandler = createPanZoomStartHandler({
            zoomPanValues,
            onPanningChange,
            onPanZoomStart,
         });

         const panZoomHandler = createPanZoomHandler({
            onPanZoom,
            onTransformChange,
         });

         const panZoomEndHandler = createPanZoomEndHandler({
            zoomPanValues,
            onPanningChange,
            onPanZoomEnd,
         });

         d3ZoomInstance.on('start', panZoomStartHandler);
         d3ZoomInstance.on('zoom', panZoomHandler);
         d3ZoomInstance.on('end', panZoomEndHandler);

         d3ZoomInstance.filter(filter);
      }
   };

   const getViewport = (): Viewport => {
      const transform = d3Selection
         ? zoomTransform(d3Selection.node() as Element)
         : { x: 0, y: 0, k: 1 };
      return { x: transform.x, y: transform.y, zoom: transform.k };
   };

   return {
      update,
      destroy,
      getViewport,
      setViewportConstrained,
   };
};
