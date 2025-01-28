import { createStore } from 'zustand';
import { zoomIdentity } from 'd3-zoom';

import { getDimensions, getPortBounds } from '@diagram/core';
import type { NodeDragItem } from '@diagram/core';

import {
   updateAbsoluteNodePositions,
   createNodeInternals,
   isIntersected,
} from './utils';

import { clampPosition } from '../utils';
import { createSelectionChange, getSelectionChanges } from '../utils/changes';

import initialState, { infiniteExtent } from './initialState';

import { internalsSymbol, CoordinateExtent, XYPosition } from '@diagram/core';
import { NodeDimensionUpdate } from './type';
import {
   NodeDimensionChange,
   NodePositionChange,
   NodeChange,
   NodeSelectionChange,
   NodeIntersectionChange,
} from '../hooks/useNodesEdgesState/type';
import { Node } from '../components/Node/type';

import { Edge } from '../components/Edges/type';
import {
   ReactDiagramState,
   UnSelectNodesParams,
} from '../components/ReactDiagramProvider/type';

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
         const {
            onNodesChange,
            updateNodesIntersection,
            nodeInternals,
            domNode,
            nodeOrigin,
         } = get();
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
                        portBounds: {
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

         updateNodesIntersection();
         updateAbsoluteNodePositions(nodeInternals, nodeOrigin);

         set({
            nodeInternals: new Map(nodeInternals),
         });

         if (changes?.length > 0) {
            onNodesChange?.(changes);
         }
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
      updateNodesIntersection: () => {
         const { nodeInternals, triggerNodeChanges } = get();

         const nodes = Array.from(nodeInternals.values());

         const unIntersectNodes = (): NodeIntersectionChange[] => {
            return nodes
               .filter(
                  (node) =>
                     node.intersected && !isIntersected(node, nodeInternals),
               )
               .map((node) => ({
                  id: node.id,
                  type: 'intersect',
                  intersected: false,
               }));
         };

         const addIntersectNodes = (): NodeIntersectionChange[] => {
            return nodes
               .filter((node) => isIntersected(node, nodeInternals))
               .map((node) => {
                  return {
                     id: node.id,
                     type: 'intersect',
                     intersected: true,
                  };
               });
         };

         const intersectedNodes = addIntersectNodes();
         const unIntersectedNodes = unIntersectNodes();

         triggerNodeChanges([...intersectedNodes, ...unIntersectedNodes]);
      },
      addSelectedNodes: (selectedNodeIds: string[]) => {
         const { multiSelectionActive, getNodes, triggerNodeChanges } = get();
         let changedNodes: NodeSelectionChange[];

         if (multiSelectionActive) {
            changedNodes = selectedNodeIds.map((nodeId) =>
               createSelectionChange(nodeId, true),
            ) as NodeSelectionChange[];
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
         }) as NodeSelectionChange[];

         triggerNodeChanges(changedNodes);
      },

      resetSelectedElements: () => {
         const { getNodes, triggerNodeChanges } = get();
         const nodes = getNodes();

         const nodesToUnselect = nodes
            .filter((e) => e.selected)
            .map((n) =>
               createSelectionChange(n.id, false),
            ) as NodeSelectionChange[];

         triggerNodeChanges(nodesToUnselect);
      },

      cancelConnection: () =>
         set({
            connectionNodeId: initialState.connectionNodeId,
            connectionPortType: initialState.connectionPortType,
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
            node.positionAbsolute = clampPosition(node.position, nodeExtent);
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

export { createRFStore };
