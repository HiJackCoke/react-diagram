import { useEffect } from 'react';

import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';
import type { Node, ReactDiagramState, ReactDiagramProps } from '../../types';

type StoreUpdaterProps = Pick<ReactDiagramProps, 'nodes'> & { rfId: string };

const selector = (s: ReactDiagramState) => ({
   setNodes: s.setNodes,
});

function useStoreUpdater<T>(
   value: T | undefined,
   setStoreState: (param: T) => void,
) {
   useEffect(() => {
      if (typeof value !== 'undefined') {
         setStoreState(value);
      }
   }, [value]);
}

const StoreUpdater = ({ nodes }: StoreUpdaterProps) => {
   const { setNodes } = useStore(selector, shallow);

   useStoreUpdater<Node[]>(nodes, setNodes);

   return null;
};

export default StoreUpdater;
