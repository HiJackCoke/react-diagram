import { createStore } from 'zustand';

import {
   updateAbsoluteNodePositions,
   createNodeInternals,
   updateNodesSelections,
} from './utils';

import { getDimensions, internalsSymbol } from 'utils';
import {
   applyNodeChanges,
   createSelectionChange,
   getSelectionChanges,
} from 'utils/changes';

import { getPortBounds } from '../components/Node/utils';

import initialState from './initialState';
import {
   NodeDimensionChange,
   NodePositionChange,
   NodeChange,
} from 'hooks/useNodesEdgesState/type';
import { NodeSelectionChange } from 'hooks/useNodesEdgesState/type';

import { Node, NodeDimensionUpdate, NodeDragItem } from 'components/Node/type';
import { Edge } from 'components/Edges/type';
import {
   ReactDiagramState,
   UnSelectNodesParams,
} from 'components/ReactDiagramProvider/type';

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

      setEdges: (edges: Edge[]) => {
         const { defaultEdgeOptions = {} } = get();
         set({ edges: edges.map((e) => ({ ...defaultEdgeOptions, ...e })) });
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
         const { multiSelectionActive, getNodes } = get();
         let changedNodes: NodeSelectionChange[];

         if (multiSelectionActive) {
            changedNodes = selectedNodeIds.map((nodeId) =>
               createSelectionChange(nodeId, true),
            ) as NodeSelectionChange[];
         } else {
            changedNodes = getSelectionChanges(getNodes(), selectedNodeIds);
         }

         updateNodesSelections({
            changedNodes,

            get,
            set,
         });
      },

      unselectNodes: ({ nodes }: UnSelectNodesParams = {}) => {
         const { getNodes } = get();
         const nodesToUnselect = nodes ? nodes : getNodes();

         const changedNodes = nodesToUnselect.map((n) => {
            n.selected = false;
            return createSelectionChange(n.id, false);
         }) as NodeSelectionChange[];

         updateNodesSelections({
            changedNodes,
            get,
            set,
         });
      },

      resetSelectedElements: () => {
         const { getNodes } = get();
         const nodes = getNodes();

         const nodesToUnselect = nodes
            .filter((e) => e.selected)
            .map((n) =>
               createSelectionChange(n.id, false),
            ) as NodeSelectionChange[];

         updateNodesSelections({
            changedNodes: nodesToUnselect,
            get,
            set,
         });
      },
   }));

export { createRFStore };
