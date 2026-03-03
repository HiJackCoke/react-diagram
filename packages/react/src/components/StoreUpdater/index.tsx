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

export type StoreUpdaterProps<
   NodeType extends Node = Node,
   EdgeType extends Edge = Edge,
> = Pick<
   ReactDiagramProps<NodeType, EdgeType>,
   | 'nodeOrigin'
   | 'nodes'
   | 'edges'
   | 'smoothStep'
   | 'centerStep'
   | 'gridStep'
   | 'elevateNodesOnSelect'
   | 'nodesDraggable'
   | 'autoPanOnNodeDrag'
   | 'autoPanOnConnect'
   | 'connectionRadius'
   | 'nodeExtent'
   | 'translateExtent'
   | 'minZoom'
   | 'maxZoom'
   | 'onDelete'
   | 'onBeforeDelete'
   | 'onNodesDelete'
   | 'onEdgesDelete'
   | 'onNodesChange'
   | 'onNodeDrag'
   | 'onNodeDragStart'
   | 'onNodeDragEnd'
   | 'onEdgesChange'
   | 'onConnect'
   | 'onConnectStart'
   | 'onConnectEnd'
   | 'onError'
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
function useDirectStoreUpdater<
   NodeType extends Node = Node,
   EdgeType extends Edge = Edge,
>(
   key: keyof ReactDiagramStore,
   value: unknown,
   setState: StoreApi<ReactDiagramState<NodeType, EdgeType>>['setState'],
) {
   useEffect(() => {
      if (typeof value !== 'undefined') {
         setState({ [key]: value });
      }
   }, [value]);
}

const StoreUpdater = <
   NodeType extends Node = Node,
   EdgeType extends Edge = Edge,
>({
   nodes,
   edges,
   nodeOrigin,
   smoothStep,
   centerStep,
   gridStep,
   elevateNodesOnSelect,
   nodesDraggable,
   autoPanOnNodeDrag,
   autoPanOnConnect,
   connectionRadius,
   nodeExtent,
   translateExtent,
   minZoom,
   maxZoom,
   onNodesChange,
   onNodeDrag,
   onNodeDragStart,
   onNodeDragEnd,
   onNodesDelete,
   onEdgesChange,
   onEdgesDelete,
   onConnect,
   onConnectStart,
   onConnectEnd,
   onError,
   onBeforeDelete,
   onDelete,
}: StoreUpdaterProps<NodeType, EdgeType>) => {
   const {
      setNodes,
      setEdges,
      setNodeExtent,
      setTranslateExtent,
      setMinZoom,
      setMaxZoom,
   } = useStore(selector, shallow);
   const store = useStoreApi<NodeType, EdgeType>();

   useStoreUpdater<NodeType[]>(nodes, setNodes);
   useStoreUpdater<EdgeType[]>(edges, setEdges);
   useStoreUpdater<CoordinateExtent>(nodeExtent, setNodeExtent);

   useStoreUpdater<CoordinateExtent>(nodeExtent, setNodeExtent);
   useStoreUpdater<CoordinateExtent>(translateExtent, setTranslateExtent);
   useStoreUpdater<number>(minZoom, setMinZoom);
   useStoreUpdater<number>(maxZoom, setMaxZoom);

   useDirectStoreUpdater<NodeType, EdgeType>(
      'nodeOrigin',
      nodeOrigin,
      store.setState,
   );
   useDirectStoreUpdater<NodeType, EdgeType>(
      'smoothStep',
      smoothStep,
      store.setState,
   );
   useDirectStoreUpdater<NodeType, EdgeType>(
      'centerStep',
      centerStep,
      store.setState,
   );
   useDirectStoreUpdater<NodeType, EdgeType>(
      'gridStep',
      gridStep,
      store.setState,
   );

   useDirectStoreUpdater<NodeType, EdgeType>(
      'elevateNodesOnSelect',
      elevateNodesOnSelect,
      store.setState,
   );

   useDirectStoreUpdater<NodeType, EdgeType>(
      'nodesDraggable',
      nodesDraggable,
      store.setState,
   );
   useDirectStoreUpdater<NodeType, EdgeType>(
      'autoPanOnNodeDrag',
      autoPanOnNodeDrag,
      store.setState,
   );
   useDirectStoreUpdater<NodeType, EdgeType>(
      'autoPanOnConnect',
      autoPanOnConnect,
      store.setState,
   );
   useDirectStoreUpdater<NodeType, EdgeType>(
      'connectionRadius',
      connectionRadius,
      store.setState,
   );

   useDirectStoreUpdater<NodeType, EdgeType>(
      'onNodesChange',
      onNodesChange,
      store.setState,
   );
   useDirectStoreUpdater<NodeType, EdgeType>(
      'onNodeDrag',
      onNodeDrag,
      store.setState,
   );
   useDirectStoreUpdater<NodeType, EdgeType>(
      'onNodeDragStart',
      onNodeDragStart,
      store.setState,
   );
   useDirectStoreUpdater<NodeType, EdgeType>(
      'onNodeDragEnd',
      onNodeDragEnd,
      store.setState,
   );

   useDirectStoreUpdater<NodeType, EdgeType>(
      'onNodesDelete',
      onNodesDelete,
      store.setState,
   );

   useDirectStoreUpdater<NodeType, EdgeType>(
      'onEdgesChange',
      onEdgesChange,
      store.setState,
   );

   useDirectStoreUpdater<NodeType, EdgeType>(
      'onEdgesDelete',
      onEdgesDelete,
      store.setState,
   );

   useDirectStoreUpdater<NodeType, EdgeType>(
      'onConnect',
      onConnect,
      store.setState,
   );
   useDirectStoreUpdater<NodeType, EdgeType>(
      'onConnectStart',
      onConnectStart,
      store.setState,
   );
   useDirectStoreUpdater<NodeType, EdgeType>(
      'onConnectEnd',
      onConnectEnd,
      store.setState,
   );

   useDirectStoreUpdater<NodeType, EdgeType>(
      'onBeforeDelete',
      onBeforeDelete,
      store.setState,
   );

   useDirectStoreUpdater<NodeType, EdgeType>(
      'onDelete',
      onDelete,
      store.setState,
   );

   useDirectStoreUpdater<NodeType, EdgeType>(
      'onError',
      onErrorWrapper(onError),
      store.setState,
   );
   return null;
};

export default StoreUpdater;
