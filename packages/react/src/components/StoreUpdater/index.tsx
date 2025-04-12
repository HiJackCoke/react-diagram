import { useEffect } from 'react';

import { StoreApi } from 'zustand';
import { shallow } from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';

import { onErrorWrapper } from '../../utils';

import { CoordinateExtent } from 'cosmos-diagram';
import { ReactDiagramProps } from '../../types';
import { Edge } from '../../components/Edges/type';
import { Node } from '../../components/Node/type';
import {
   ReactDiagramStore,
   ReactDiagramState,
} from '../../components/ReactDiagramProvider/type';

export type StoreUpdaterProps = Pick<
   ReactDiagramProps,
   | 'nodeOrigin'
   | 'nodes'
   | 'onNodesChange'
   | 'onNodeDrag'
   | 'onNodeDragStart'
   | 'onNodeDragEnd'
   | 'edges'
   | 'onEdgesChange'
   | 'smoothStep'
   | 'centerStep'
   | 'gridStep'
   | 'elevateNodesOnSelect'
   | 'nodesDraggable'
   | 'autoPanOnNodeDrag'
   | 'autoPanOnConnect'
   | 'onConnect'
   | 'onConnectStart'
   | 'onConnectEnd'
   | 'connectionRadius'
   | 'onError'
   | 'nodeExtent'
   | 'translateExtent'
   | 'minZoom'
   | 'maxZoom'
> & {
   rfId: string;
};

const selector = (s: ReactDiagramState) => {
   const {
      setNodes,
      setEdges,
      setNodeExtent,
      setTranslateExtent,
      setMinZoom,
      setMaxZoom,
   } = s;
   return {
      setNodes,
      setEdges,
      setNodeExtent,
      setTranslateExtent,
      setMinZoom,
      setMaxZoom,
   };
};

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
   onNodeDrag,
   onNodeDragStart,
   onNodeDragEnd,
   edges,
   onEdgesChange,
   nodeOrigin,
   smoothStep,
   centerStep,
   gridStep,
   elevateNodesOnSelect,
   nodesDraggable,
   autoPanOnNodeDrag,
   autoPanOnConnect,
   connectionRadius,
   onConnect,
   onConnectStart,
   onConnectEnd,
   onError,
   nodeExtent,
   translateExtent,
   minZoom,
   maxZoom,
}: StoreUpdaterProps) => {
   const {
      setNodes,
      setEdges,
      setNodeExtent,
      setTranslateExtent,
      setMinZoom,
      setMaxZoom,
   } = useStore(selector, shallow);
   const store = useStoreApi();

   useStoreUpdater<Node[]>(nodes, setNodes);
   useStoreUpdater<Edge[]>(edges, setEdges);
   useStoreUpdater<CoordinateExtent>(nodeExtent, setNodeExtent);

   useStoreUpdater<CoordinateExtent>(nodeExtent, setNodeExtent);
   useStoreUpdater<CoordinateExtent>(translateExtent, setTranslateExtent);
   useStoreUpdater<number>(minZoom, setMinZoom);
   useStoreUpdater<number>(maxZoom, setMaxZoom);

   useDirectStoreUpdater('nodeOrigin', nodeOrigin, store.setState);
   useDirectStoreUpdater('smoothStep', smoothStep, store.setState);
   useDirectStoreUpdater('centerStep', centerStep, store.setState);
   useDirectStoreUpdater('gridStep', gridStep, store.setState);

   useDirectStoreUpdater(
      'elevateNodesOnSelect',
      elevateNodesOnSelect,
      store.setState,
   );

   useDirectStoreUpdater('nodesDraggable', nodesDraggable, store.setState);
   useDirectStoreUpdater(
      'autoPanOnNodeDrag',
      autoPanOnNodeDrag,
      store.setState,
   );
   useDirectStoreUpdater('autoPanOnConnect', autoPanOnConnect, store.setState);
   useDirectStoreUpdater('connectionRadius', connectionRadius, store.setState);

   useDirectStoreUpdater('onNodesChange', onNodesChange, store.setState);
   useDirectStoreUpdater('onNodeDrag', onNodeDrag, store.setState);
   useDirectStoreUpdater('onNodeDragStart', onNodeDragStart, store.setState);
   useDirectStoreUpdater('onNodeDragEnd', onNodeDragEnd, store.setState);

   useDirectStoreUpdater('onEdgesChange', onEdgesChange, store.setState);

   useDirectStoreUpdater('onConnect', onConnect, store.setState);
   useDirectStoreUpdater('onConnectStart', onConnectStart, store.setState);
   useDirectStoreUpdater('onConnectEnd', onConnectEnd, store.setState);

   useDirectStoreUpdater('onError', onErrorWrapper(onError), store.setState);

   return null;
};

export default StoreUpdater;
