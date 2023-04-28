import { useCallback } from 'react';

import { useStore } from '../hooks/useStore';

import type { ReactDiagramState } from '../types';

function useVisibleNodes() {
   const nodes = useStore(
      useCallback((s: ReactDiagramState) => s.getNodes(), []),
   );

   return nodes;
}

export default useVisibleNodes;
