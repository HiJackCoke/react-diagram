import { useEffect } from 'react';

import { StoreApi } from 'zustand';
import { shallow } from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';
import {
   Node,
   ReactDiagramState,
   ReactDiagramProps,
   ReactDiagramStore,
} from '../../types';

type StoreUpdaterProps = Pick<ReactDiagramProps, 'nodes' | 'onNodesChange'> & {
   rfId: string;
};

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

// updates with values in store that don't have a dedicated setter function
function useDirectStoreUpdater(
   key: keyof ReactDiagramStore,
   value: unknown,
   setState: StoreApi<ReactDiagramState>['setState'],
) {
   useEffect(() => {
      if (typeof value !== 'undefined') {
         setState({ [key]: value });
      }
   }, [value]);
}

const StoreUpdater = ({ nodes, onNodesChange }: StoreUpdaterProps) => {
   const { setNodes } = useStore(selector, shallow);
   const store = useStoreApi();

   useDirectStoreUpdater('onNodesChange', onNodesChange, store.setState);

   useStoreUpdater<Node[]>(nodes, setNodes);

   return null;
};

export default StoreUpdater;
