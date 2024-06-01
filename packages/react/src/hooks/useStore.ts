import { useContext, useMemo } from 'react';
import { useStore as useZustandStore } from 'zustand';
import type { StoreApi } from 'zustand';

import StoreContext from '../contexts/RFStoreContext';

import { errorMessages } from '@diagram/core';

import { ReactDiagramState } from '../components/ReactDiagramProvider/type';

const zustandErrorMessage = errorMessages['001']();

type ExtractState = StoreApi<ReactDiagramState> extends {
   getState: () => infer T;
}
   ? T
   : never;

// 변경 사항이 발생할때 값을 구독
function useStore<StateSlice = ExtractState>(
   selector: (state: ReactDiagramState) => StateSlice,
   equalityFn?: (a: StateSlice, b: StateSlice) => boolean,
) {
   const store = useContext(StoreContext);

   if (store === null) {
      throw new Error(zustandErrorMessage);
   }

   return useZustandStore(store, selector, equalityFn);
}

// 필요에 따라 값을 계산
const useStoreApi = () => {
   const store = useContext(StoreContext);

   if (store === null) {
      throw new Error(zustandErrorMessage);
   }

   return useMemo(
      () => ({
         getState: store.getState,
         setState: store.setState,
         subscribe: store.subscribe,
         destroy: store.destroy,
      }),
      [store],
   );
};

export { useStore, useStoreApi };
