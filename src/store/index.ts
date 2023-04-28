import { createStore } from 'zustand';

import { getDimensions, internalsSymbol } from '../utils';

import { updateAbsoluteNodePositions, createNodeInternals } from './utils';

import { getPortBounds } from '../components/Node/utils';

import initialState from './initialState';
import type {
   Node,
   ReactDiagramState,
   NodeDimensionUpdate,
   NodeDimensionChange,
   UnselectNodesParams,
} from '../types';

const createRFStore = () =>
   createStore<ReactDiagramState>((set, get) => ({
      ...initialState,
      setNodes: (nodes: Node[]) => {
         const { nodeInternals, nodeOrigin, elevateNodesOnSelect } = get();
         set({
            nodeInternals: createNodeInternals(
               nodes,
               nodeInternals,
               nodeOrigin,
               elevateNodesOnSelect,
            ),
         });
      },

      getNodes: () => {
         return Array.from(get().nodeInternals.values());
      },

      updateNodeDimensions: (updates: NodeDimensionUpdate[]) => {
         const { onNodesChange, nodeInternals, domNode, nodeOrigin } = get();
         const viewportNode = domNode?.querySelector(
            '.react-diagram__viewport',
         );

         if (!viewportNode) {
            return;
         }

         const style = window.getComputedStyle(viewportNode);
         const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);

         const changes: NodeDimensionChange[] = updates.reduce<
            NodeDimensionChange[]
         >((res, update) => {
            const node = nodeInternals.get(update.id);

            if (node) {
               const dimensions = getDimensions(update.nodeElement);
               const doUpdate = !!(
                  dimensions.width &&
                  dimensions.height &&
                  (node.width !== dimensions.width ||
                     node.height !== dimensions.height ||
                     update.forceUpdate)
               );

               if (doUpdate) {
                  nodeInternals.set(node.id, {
                     ...node,
                     [internalsSymbol]: {
                        ...node[internalsSymbol],
                        handleBounds: {
                           source: getPortBounds(
                              '.source',
                              update.nodeElement,
                              zoom,
                              nodeOrigin,
                           ),
                           target: getPortBounds(
                              '.target',
                              update.nodeElement,
                              zoom,

                              nodeOrigin,
                           ),
                        },
                     },
                     ...dimensions,
                  });
                  res.push({
                     id: node.id,
                     type: 'dimensions',
                     dimensions,
                  });
               }
            }

            return res;
         }, []);

         updateAbsoluteNodePositions(nodeInternals, nodeOrigin);

         if (changes?.length > 0) {
            onNodesChange?.(changes);
         }
      },

      addSelectedNodes: (_selectedNodeIds: string[]) => {},

      unselectNodes: ({ nodes }: UnselectNodesParams = {}) => {},
   }));

export { createRFStore };
