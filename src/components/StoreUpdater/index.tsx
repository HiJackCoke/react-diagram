import { useEffect } from 'react';

import { StoreApi } from 'zustand';
import { shallow } from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';

import { ReactDiagramProps } from 'types';
import { Edge } from 'components/Edges/type';
import { Node } from 'components/Node/type';
import {
   ReactDiagramStore,
   ReactDiagramState,
} from 'components/ReactDiagramProvider/type';

export type StoreUpdaterProps = Pick<
   ReactDiagramProps,
   | 'nodes'
   | 'onNodesChange'
   | 'edges'
   | 'onEdgesChange'
   | 'gridStep'
   | 'elevateNodesOnSelect'
   | 'nodesDraggable'
   | 'onConnect'
   | 'onConnectEnd'
> & {
   rfId: string;
};

const selector = (s: ReactDiagramState) => ({
   setNodes: s.setNodes,
   setEdges: s.setEdges,
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

const StoreUpdater = ({
   nodes,
   onNodesChange,
   edges,
   onEdgesChange,
   gridStep,
   elevateNodesOnSelect,
   nodesDraggable,
   onConnect,
   onConnectEnd,
}: StoreUpdaterProps) => {
   const { setNodes, setEdges } = useStore(selector, shallow);
   const store = useStoreApi();

   useDirectStoreUpdater('gridStep', gridStep, store.setState);

   useStoreUpdater<Node[]>(nodes, setNodes);
   useStoreUpdater<Edge[]>(edges, setEdges);

   useDirectStoreUpdater(
      'elevateNodesOnSelect',
      elevateNodesOnSelect,
      store.setState,
   );

   useDirectStoreUpdater('nodesDraggable', nodesDraggable, store.setState);

   useDirectStoreUpdater('onNodesChange', onNodesChange, store.setState);
   useDirectStoreUpdater('onEdgesChange', onEdgesChange, store.setState);
   useDirectStoreUpdater('onConnect', onConnect, store.setState);
   useDirectStoreUpdater('onConnectEnd', onConnectEnd, store.setState);

   return null;
};

export default StoreUpdater;
