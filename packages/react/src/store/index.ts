import { createStore } from 'zustand';
import { zoomIdentity } from 'd3-zoom';

import {
   getDimensions,
   getPortBounds,
   clampPosition,
   createNodeInternals,
   isIntersected,
   internalsSymbol,
   validateBeforeDelete,
} from 'cosmos-diagram';
import type {
   CoordinateExtent,
   NodeDragItem,
   XYPosition,
} from 'cosmos-diagram';

import {
   createSelectionChange,
   getSelectionChanges,
   getTypeChanges,
} from '../utils/changes';

import initialState, { infiniteExtent } from './initialState';

import {
   NodeDimensionChange,
   NodePositionChange,
   NodeChange,
   NodeSelectionChange,
   NodeIntersectionChange,
   NodeDimensionUpdate,
   EdgeChange,
} from '../types/general';
import { Node } from '../components/Node/type';

import { Edge } from '../components/Edges/type';
import {
   ReactDiagramState,
   UnSelectEdgesParams,
   UnSelectNodesParams,
} from '../components/ReactDiagramProvider/type';

const createRCDStore = () =>
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
         const { triggerNodeChanges, nodeInternals, domNode, nodeOrigin } =
            get();
         const viewportNode = domNode?.querySelector(
            '.react-diagram__viewport',
         );

         if (!viewportNode) {
            return;
         }

         const style = window.getComputedStyle(viewportNode);
         const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);

         const intersectionChanges: NodeIntersectionChange[] = [];
         const positionChanges: NodePositionChange[] = [];
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
                  const dimensionedNode = {
                     ...node,
                     [internalsSymbol]: {
                        ...node[internalsSymbol],
                        portBounds: {
                           id: node[internalsSymbol]?.portBounds?.id || null,
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
                  };

                  nodeInternals.set(node.id, dimensionedNode);

                  const nextIntersected = isIntersected(
                     dimensionedNode,
                     nodeInternals,
                  );

                  if (node.intersected !== nextIntersected) {
                     intersectionChanges.push({
                        id: node.id,
                        type: 'intersect',
                        intersected: nextIntersected,
                     });
                  }

                  positionChanges.push({
                     id: node.id,
                     type: 'position',
                     dragging: false,
                     position: node.position,
                     positionAbsolute: node.positionAbsolute,
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

         set({
            nodeInternals: new Map(nodeInternals),
         });

         triggerNodeChanges([
            ...changes,
            ...intersectionChanges,
            ...positionChanges,
         ]);
      },
      updateNodesPosition: (
         nodes: NodeDragItem[] | Node[],
         dragging = false,
         updateFunc,
      ) => {
         const { triggerNodeChanges } = get();

         const changes = nodes.map((node) => {
            const change: NodePositionChange = {
               id: node.id,
               type: 'position',
               dragging,
            };

            if (updateFunc) {
               updateFunc(node);

               return {
                  ...change,
                  position: node.position,
                  positionAbsolute: node.positionAbsolute,
               };
            }

            return change;
         });

         triggerNodeChanges(changes);
      },

      triggerNodeChanges: (changes: NodeChange[]) => {
         const { onNodesChange } = get();

         if (changes?.length) {
            onNodesChange?.(changes);
         }
      },

      triggerEdgeChanges: (changes: EdgeChange[]) => {
         const { onEdgesChange } = get();

         if (changes?.length) {
            onEdgesChange?.(changes);
         }
      },

      updateNodesIntersection: () => {
         const { nodeInternals, triggerNodeChanges } = get();

         const nodes = Array.from(nodeInternals.values());

         const intersectionChanges: NodeIntersectionChange[] = [];

         nodes.forEach((node) => {
            const nextIntersected = isIntersected(node, nodeInternals);

            if (node.intersected !== nextIntersected) {
               intersectionChanges.push({
                  id: node.id,
                  type: 'intersect',
                  intersected: nextIntersected,
               });
            }
         });

         triggerNodeChanges(intersectionChanges);
      },

      addSelectedNodes: (selectedNodeIds: string[]) => {
         const { multiSelectionActive, getNodes, triggerNodeChanges } = get();
         let changedNodes: NodeSelectionChange[];

         if (multiSelectionActive) {
            changedNodes = selectedNodeIds.map((nodeId) =>
               createSelectionChange(nodeId, true),
            );
         } else {
            changedNodes = getSelectionChanges(getNodes(), selectedNodeIds);
         }

         triggerNodeChanges(changedNodes);
      },

      unselectNodes: ({ nodes }: UnSelectNodesParams = {}) => {
         const { getNodes, triggerNodeChanges } = get();
         const nodesToUnselect = nodes ? nodes : getNodes();

         const changedNodes = nodesToUnselect.map((n) => {
            n.selected = false;
            return createSelectionChange(n.id, false);
         });

         triggerNodeChanges(changedNodes);
      },

      addSelectedEdges: (selectedEdgeIds) => {
         const {
            multiSelectionActive,
            getNodes,
            edges,
            triggerNodeChanges,
            triggerEdgeChanges,
         } = get();

         const nodes = getNodes();
         if (multiSelectionActive) {
            const changedEdges = selectedEdgeIds.map((edgeId) =>
               createSelectionChange(edgeId, true),
            );
            triggerEdgeChanges(changedEdges);
            return;
         }

         triggerEdgeChanges(getSelectionChanges(edges, selectedEdgeIds));
         triggerNodeChanges(getSelectionChanges(nodes, []));
      },

      unselectEdges: ({ edges }: UnSelectEdgesParams = {}) => {
         const { edges: allEdges, triggerEdgeChanges } = get();
         const edgesToUnselect = edges ? edges : allEdges;

         const changedEdges = edgesToUnselect.map((n) => {
            n.selected = false;
            return createSelectionChange(n.id, false);
         });

         triggerEdgeChanges(changedEdges);
      },

      resetSelectedElements: () => {
         const { edges, getNodes, triggerNodeChanges, triggerEdgeChanges } =
            get();
         const nodes = getNodes();

         const nodesToUnselect = nodes
            .filter((e) => e.selected)
            .map((n) => createSelectionChange(n.id, false));

         const edgesToUnselect = edges
            .filter((e) => e.selected)
            .map((n) => createSelectionChange(n.id, false));

         triggerNodeChanges(nodesToUnselect);
         triggerEdgeChanges(edgesToUnselect);
      },

      deleteElements: async (elementsToDelete) => {
         const {
            // nodes,
            edges,
            getNodes,
            onBeforeDelete,
            onDelete,
            onNodesDelete,
            onEdgesDelete,
            triggerNodeChanges,
            triggerEdgeChanges,
         } = get();
         const nodes = getNodes();

         await validateBeforeDelete(
            elementsToDelete,
            { nodes, edges },
            {
               onBeforeDelete,
               onDelete: ({ nodes, edges }) => {
                  const hasMatchingNodes = nodes.length > 0;
                  const hasMatchingEdges = edges.length > 0;

                  if (hasMatchingNodes) {
                     const nodeChanges = nodes.map(getTypeChanges('remove'));
                     onNodesDelete?.(nodes);
                     triggerNodeChanges(nodeChanges);
                  }

                  if (hasMatchingEdges) {
                     const edgeChanges = edges.map(getTypeChanges('remove'));
                     onEdgesDelete?.(edges);
                     triggerEdgeChanges(edgeChanges);
                  }

                  onDelete?.({ nodes: nodes, edges: edges });
               },
            },
         );
      },
      cancelConnection: () =>
         set({
            connectionStartPort: null,
            connectionEndPort: null,
         }),

      updateConnection: (params) => {
         const { connectionPosition } = get();

         const currentConnection = {
            ...params,
            connectionPosition: params.connectionPosition ?? connectionPosition,
         };

         set(currentConnection);
      },

      panBy: (delta: XYPosition) => {
         const { transform, width, height, d3Zoom, d3Selection } = get();

         if (!d3Zoom || !d3Selection || (!delta.x && !delta.y)) {
            return;
         }

         const nextTransform = zoomIdentity
            .translate(transform[0] + delta.x, transform[1] + delta.y)
            .scale(transform[2]);

         const extent: CoordinateExtent = [
            [0, 0],
            [width, height],
         ];

         const constrainedTransform = d3Zoom?.constrain()(
            nextTransform,
            extent,
            infiniteExtent,
         );
         d3Zoom.transform(d3Selection, constrainedTransform);
      },
      setNodeExtent: (nodeExtent: CoordinateExtent) => {
         const { nodeInternals } = get();

         nodeInternals.forEach((node) => {
            node.positionAbsolute = clampPosition(
               node.positionAbsolute,
               nodeExtent,
            );
         });

         set({
            nodeExtent,
            nodeInternals: new Map(nodeInternals),
         });
      },
      setTranslateExtent: (translateExtent: CoordinateExtent) => {
         get().d3Zoom?.translateExtent(translateExtent);

         set({ translateExtent });
      },
      setMinZoom: (minZoom: number) => {
         const { d3Zoom, maxZoom } = get();
         d3Zoom?.scaleExtent([minZoom, maxZoom]);

         set({ minZoom });
      },
      setMaxZoom: (maxZoom: number) => {
         const { d3Zoom, minZoom } = get();
         d3Zoom?.scaleExtent([minZoom, maxZoom]);

         set({ maxZoom });
      },
   }));

export { createRCDStore };
