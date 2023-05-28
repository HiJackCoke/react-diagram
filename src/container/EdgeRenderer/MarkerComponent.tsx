import { memo, useCallback } from 'react';

import { useStore } from '../../hooks/useStore';
import { getMarkerId } from '../../utils/graph';
import { useMarkerSymbol } from './MarkerSymbols';
import type { EdgeMarker, ReactDiagramState } from '../../types';

type MarkerProps = EdgeMarker & {
   id: string;
};

type MarkerComponentProps = {
   defaultColor: string;
   rfId?: string;
};

const Marker = ({
   id,
   type,
   color,
   width = 12.5,
   height = 12.5,
   markerUnits = 'strokeWidth',
   strokeWidth,
   orient = 'auto-start-reverse',
}: MarkerProps) => {
   const Symbol = useMarkerSymbol(type);

   if (!Symbol) {
      return null;
   }

   return (
      <marker
         className="react-diagram__arrowhead"
         id={id}
         markerWidth={`${width}`}
         markerHeight={`${height}`}
         viewBox="-10 -10 20 20"
         markerUnits={markerUnits}
         orient={orient}
         refX="0"
         refY="0"
      >
         <Symbol color={color} strokeWidth={strokeWidth} />
      </marker>
   );
};

const markerSelector =
   ({ defaultColor, rfId }: { defaultColor: string; rfId?: string }) =>
   (s: ReactDiagramState) => {
      const ids: string[] = [];

      return s.edges
         .reduce<MarkerProps[]>((markers, edge) => {
            [edge.markerStart, edge.markerEnd].forEach((marker) => {
               if (marker && typeof marker === 'object') {
                  const markerId = getMarkerId(marker, rfId);
                  if (!ids.includes(markerId)) {
                     markers.push({
                        id: markerId,
                        color: marker.color || defaultColor,
                        ...marker,
                     });
                     ids.push(markerId);
                  }
               }
            });
            return markers;
         }, [])
         .sort((a, b) => a.id.localeCompare(b.id));
   };

const MarkerComponent = ({ defaultColor, rfId }: MarkerComponentProps) => {
   const markers = useStore(
      useCallback(markerSelector({ defaultColor, rfId }), [defaultColor, rfId]),
      (a, b) =>
         !(
            a.length !== b.length ||
            a.some((marker, i) => marker.id !== b[i].id)
         ),
   );

   return (
      <defs>
         {markers.map((marker: MarkerProps) => (
            <Marker
               id={marker.id}
               key={marker.id}
               type={marker.type}
               color={marker.color}
               width={marker.width}
               height={marker.height}
               markerUnits={marker.markerUnits}
               strokeWidth={marker.strokeWidth}
               orient={marker.orient}
            />
         ))}
      </defs>
   );
};

MarkerComponent.displayName = 'MarkerComponent';

export default memo(MarkerComponent);
