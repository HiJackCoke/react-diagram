import { EdgeMarker } from '../types';

export const getMarkerId = (
   marker: EdgeMarker | undefined,
   id?: string,
): string => {
   if (typeof marker === 'undefined') return '';

   if (typeof marker === 'string') return marker;

   const idPrefix = id ? `${id}__` : '';
   const markerKeys = Object.keys(marker);

   return `${idPrefix}${markerKeys
      .sort()
      .map((key) => `${key}=${marker[key as keyof EdgeMarker]}`)
      .join('&')}`;
};
