import { useRef } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { StoreApi } from 'zustand';

import { Provider } from '../../contexts/RCDStoreContext';
import { createRCDStore } from '../../store';
import { ReactDiagramState } from './type';

const ReactDiagramProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
   const storeRef = useRef<StoreApi<ReactDiagramState> | null>(null);

   if (!storeRef.current) {
      storeRef.current = createRCDStore();
   }

   return <Provider value={storeRef.current}>{children}</Provider>;
};

ReactDiagramProvider.displayName = 'ReactDiagramProvider';

export default ReactDiagramProvider;
