import { ZoomTransform, zoomIdentity } from 'd3-zoom';
import { D3SelectionInstance, Viewport } from '../types';

export const transformToViewport = (transform: ZoomTransform): Viewport => {
   const { x, y, k } = transform;
   return {
      x,
      y,
      zoom: k,
   };
};

export const viewportToTransform = ({ x, y, zoom }: Viewport): ZoomTransform =>
   zoomIdentity.translate(x, y).scale(zoom);

export const isWrappedWithClass = (event: any, className: string | undefined) =>
   event.target.closest(`.${className}`);

export const isViewChanged = (
   prevViewport: Viewport,
   eventViewport: ZoomTransform,
): boolean => {
   const { x: prevX, y: prevY, zoom: prevZoom } = prevViewport;
   const { x, y, k } = eventViewport;
   return prevX !== x || prevY !== y || prevZoom !== k;
};

export const getD3Transition = (
   selection: D3SelectionInstance,
   duration = 0,
) =>
   typeof duration === 'number' && duration > 0
      ? selection.transition().duration(duration)
      : selection;
