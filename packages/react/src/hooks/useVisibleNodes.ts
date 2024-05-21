import { useCallback } from 'react';

import { useStore } from './useStore';

import { ReactDiagramState } from '../components/ReactDiagramProvider/type';

function useVisibleNodes() {
   const nodes = useStore(
      useCallback((s: ReactDiagramState) => s.getNodes(), []),
   );

   return nodes;
}

export default useVisibleNodes;
