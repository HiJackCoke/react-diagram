import { D3ZoomEvent, zoomTransform } from 'd3-zoom';
import { isViewChanged, transformToViewport } from './utils';
import {
   Viewport,
   PanZoomStartHandlerParams,
   PanZoomParamsHandlerParams,
   PanZoomEndHandlerParams,
   PanClickHandlerParams,
} from '../types';

export const createPanZoomStartHandler = ({
   zoomPanValues,
   onPanningChange,
   onPanZoomStart,
}: PanZoomStartHandlerParams) => {
   return (event: D3ZoomEvent<HTMLDivElement, any>) => {
      if (event.sourceEvent?.internal) {
         return;
      }

      const viewport = transformToViewport(event.transform);

      // we need to remember it here, because it's always 0 in the "zoom" event
      zoomPanValues.mouseButton = event.sourceEvent?.button || 0;
      zoomPanValues.isZoomingOrPanning = true;
      zoomPanValues.prevViewport = viewport;

      const eventType = event.sourceEvent?.type;
      if (onPanningChange) {
         if (eventType === 'mousedown' || eventType === 'touchstart') {
            onPanningChange(true);
         }
      }

      if (onPanZoomStart) {
         onPanZoomStart?.(
            event.sourceEvent as MouseEvent | TouchEvent,
            viewport,
         );
      }
   };
};

export const createPanZoomHandler = ({
   onPanZoom,
   onTransformChange,
}: PanZoomParamsHandlerParams) => {
   return (event: D3ZoomEvent<HTMLDivElement, any>) => {
      if (onTransformChange) {
         if (!event.sourceEvent?.sync) {
            onTransformChange([
               event.transform.x,
               event.transform.y,
               event.transform.k,
            ]);
         }
      }

      if (onPanZoom && !event.sourceEvent?.internal) {
         onPanZoom?.(
            event.sourceEvent as MouseEvent | TouchEvent,
            transformToViewport(event.transform),
         );
      }
   };
};

export const createPanZoomEndHandler = ({
   zoomPanValues,
   onPanningChange,
   onPanZoomEnd,
}: PanZoomEndHandlerParams) => {
   return (event: D3ZoomEvent<HTMLDivElement, any>) => {
      if (event.sourceEvent?.internal) {
         return;
      }

      zoomPanValues.isZoomingOrPanning = false;

      if (onPanningChange) {
         onPanningChange(false);
      }

      if (
         onPanZoomEnd &&
         isViewChanged(zoomPanValues.prevViewport, event.transform)
      ) {
         const viewport = transformToViewport(event.transform);
         zoomPanValues.prevViewport = viewport;

         clearTimeout(zoomPanValues.timerId);
         zoomPanValues.timerId = setTimeout(() => {
            onPanZoomEnd?.(
               event.sourceEvent as MouseEvent | TouchEvent,
               viewport,
            );
         }, 0);
      }
   };
};

// export function createZoomOnScrollHandler({
//    d3ZoomHandler,
// }: PanZoomOnScrollParams) {
//    return function (this: Element, event: any, d: unknown) {
//       console.log(event);
//       event.preventDefault();

//       d3ZoomHandler.call(this, event, d);
//    };
// }

export const createPaneClickHandler = ({
   // d3ClickHandler,
   filter,
   onPaneClick,
}: PanClickHandlerParams) => {
   return function (this: Element, event: any) {
      if (filter) {
         if (!filter(event)) return null;
      }

      const transform = zoomTransform(this);
      const viewport: Viewport = {
         x: transform.x,
         y: transform.y,
         zoom: transform.k,
      };

      if (onPaneClick) {
         onPaneClick?.(event as PointerEvent, viewport);
      }
   };
};
