import { useMemo } from 'react';

import { useStoreApi } from '../../hooks/useStore';
import { EdgeMarker, MarkerType } from 'cosmos-diagram';

type SymbolProps = Omit<EdgeMarker, 'type'>;

const ArrowSymbol = ({ color = 'none', strokeWidth = 1 }: SymbolProps) => (
   <polyline
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      fill={color}
      points="-5,-4 0,0 -5,4 -5,-4"
   />
);

export const MarkerSymbols = {
   [MarkerType.Arrow]: ArrowSymbol,
};

export function useMarkerSymbol(type: MarkerType) {
   const store = useStoreApi();

   const symbol = useMemo(() => {
      const symbolExists = Object.prototype.hasOwnProperty.call(
         MarkerSymbols,
         type,
      );

      if (!symbolExists) {
         store.getState().onError?.('022', type);

         return null;
      }

      return MarkerSymbols[type];
   }, [type]);

   return symbol;
}

export default MarkerSymbols;
