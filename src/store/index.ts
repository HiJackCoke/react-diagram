import { createStore } from 'zustand';

import { getDimensions, internalsSymbol } from '../utils';
import { applyNodeChanges } from 'utils/changes';

import { updateAbsoluteNodePositions, createNodeInternals } from './utils';

import { getPortBounds } from '../components/Node/utils';

import initialState from './initialState';
import type {
   Node,
   ReactDiagramState,
   NodeDimensionUpdate,
   NodeDimensionChange,
   UnselectNodesParams,
   NodeDragItem,
   NodePositionChange,
   NodeChange,
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

      getNodes: () => Array.from(get().nodeInternals.values()),

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
      updateNodePositions: (
         nodeDragItems: NodeDragItem[] | Node[],
         positionChanged = true,
         dragging = false,
      ) => {
         const { triggerNodeChanges } = get();

         const changes = nodeDragItems.map((node) => {
            const change: NodePositionChange = {
               id: node.id,
               type: 'position',
               dragging,
            };

            if (positionChanged) {
               change.positionAbsolute = node.positionAbsolute;
               change.position = node.position;
            }

            return change;
         });

         triggerNodeChanges(changes);
      },

      triggerNodeChanges: (changes: NodeChange[]) => {
         const {
            onNodesChange,
            nodeInternals,
            hasDefaultNodes,
            nodeOrigin,
            getNodes,
            elevateNodesOnSelect,
         } = get();

         if (changes?.length) {
            if (hasDefaultNodes) {
               const nodes = applyNodeChanges(changes, getNodes());
               const nextNodeInternals = createNodeInternals(
                  nodes,
                  nodeInternals,
                  nodeOrigin,
                  elevateNodesOnSelect,
               );
               set({ nodeInternals: nextNodeInternals });
            }

            onNodesChange?.(changes);
         }
      },

      addSelectedNodes: (selectedNodeIds: string[]) => {
         console.log(selectedNodeIds);
      },

      unselectNodes: ({ nodes }: UnselectNodesParams = {}) => {
         console.log(nodes);
      },
   }));

export { createRFStore };
