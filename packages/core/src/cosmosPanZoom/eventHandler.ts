import { D3ZoomEvent } from 'd3-zoom';
import {
   isViewChanged,
   isWrappedWithClass,
   transformToViewport,
} from './utils';
import {
   D3ZoomHandler,
   OnPanningChange,
   OnMove,
   OnTransformChange,
   Viewport,
} from '../types';

export type ZoomPanValues = {
   isZoomingOrPanning: boolean;
   // usedRightMouseButton: boolean;
   prevViewport: Viewport;
   mouseButton: number;
   timerId: ReturnType<typeof setTimeout> | undefined;
   // panScrollTimeout: ReturnType<typeof setTimeout> | undefined;
   isPanScrolling: boolean;
};

export type PanZoomStartHandlerParams = {
   zoomPanValues: ZoomPanValues;
   onPanningChange: OnPanningChange;
   onPanZoomStart?: OnMove;
};

export type PanZoomParamsHandlerParams = {
   onPanZoom?: OnMove;
   onTransformChange: OnTransformChange;
};

export type PanZoomEndHandlerParams = {
   zoomPanValues: ZoomPanValues;
   onPanZoomEnd?: OnMove;
   onPanningChange: OnPanningChange;
};

export type PanZoomOnScrollParams = {
   d3ZoomHandler: D3ZoomHandler;
};

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

      if (event.sourceEvent?.type === 'mousedown') {
         onPanningChange(true);
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
      if (!event.sourceEvent?.sync) {
         onTransformChange([
            event.transform.x,
            event.transform.y,
            event.transform.k,
         ]);
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

      onPanningChange(false);

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

export function createZoomOnScrollHandler({
   d3ZoomHandler,
}: PanZoomOnScrollParams) {
   return function (this: Element, event: any, d: unknown) {
      event.preventDefault();

      d3ZoomHandler.call(this, event, d);
   };
}
