import { EdgeMarker } from '../types';

export const getMarkerId = (
   marker: EdgeMarker | undefined,
   id?: string | null,
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

// export function createMarkerIds(
//    edges: EdgeBase[],
//    {
//       id,
//       defaultColor,
//       defaultMarkerStart,
//       defaultMarkerEnd,
//    }: {
//       id?: string | null;
//       defaultColor?: string;
//       defaultMarkerStart?: EdgeMarker;
//       defaultMarkerEnd?: EdgeMarker;
//    },
// ) {
//    const ids = new Set<string>();

//    return edges
//       .reduce<(EdgeMarker & { id: string })[]>((markers, edge) => {
//          [
//             edge.markerStart || defaultMarkerStart,
//             edge.markerEnd || defaultMarkerEnd,
//          ].forEach((marker) => {
//             if (marker && typeof marker === 'object') {
//                const markerId = getMarkerId(marker, id);
//                if (!ids.has(markerId)) {
//                   markers.push({
//                      id: markerId,
//                      color: marker.color || defaultColor,
//                      ...marker,
//                   });
//                   ids.add(markerId);
//                }
//             }
//          });

//          return markers;
//       }, [])
//       .sort((a, b) => a.id.localeCompare(b.id));
// }
