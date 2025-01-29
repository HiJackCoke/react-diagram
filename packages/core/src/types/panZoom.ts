import { Viewport } from './general';
import { CoordinateExtent, Transform } from './utils';
import { ZoomTransform } from 'd3-zoom';

export type PanZoomParams = {
   domNode: Element;
   // noPanClassName?: string;
   panning?: boolean;
   minZoom: number;
   maxZoom: number;
   viewport: Viewport;
   translateExtent: CoordinateExtent;

   onTransformChange: OnTransformChange;
   onPanningChange: OnPanningChange;
   onPanZoomStart?: OnMove;
   onPanZoom?: OnMove;
   onPanZoomEnd?: OnMove;
};

export type OnTransformChange = (transform: Transform) => void;
export type OnPanningChange = (panning: boolean) => void;

export type OnMove = (
   event: MouseEvent | TouchEvent,
   viewport: Viewport,
) => void;

export type PanZoomTransformOptions = {
   duration?: number;
};
export type PanZoomUpdateOptions = {
   noPanClassName?: string;
   selection?: boolean;
};

export type PanZoomInstance = {
   update: (params: PanZoomUpdateOptions) => void;
   destroy: () => void;

   getViewport: () => Viewport;
   setViewportConstrained?: (
      viewport: Viewport,
      extent: CoordinateExtent,
      translateExtent: CoordinateExtent,
   ) => ZoomTransform;
};
