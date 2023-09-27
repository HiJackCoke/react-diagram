import { forwardRef } from 'react';

import DiagramView from './DiagramView';
import StoreUpdater from 'components/StoreUpdater';

import { infiniteExtent } from 'store/initialState';

import { useNodeOrEdgeTypes } from 'hooks/useNodeOrEdgeTypes';

import Nodes from 'components/Node';
import StepEdge from 'components/Edges/StepEdge';

import { createNodeTypes } from 'container/NodeRenderer/utils';
import { createEdgeTypes } from 'container/EdgeRenderer/utils';

import Wrapper from './Wrapper';

import {
   ReactDiagramRefType,
   ReactDiagramProps,
   Viewport,
   NodeOrigin,
   NodeTypes,
   EdgeTypes,
} from 'types';

import './style.css';

const initViewport: Viewport = { x: 0, y: 0, zoom: 1 };
const initNodeOrigin: NodeOrigin = [0, 0];

const defaultNodeTypes: NodeTypes = {
   default: Nodes,
};

const defaultEdgeTypes: EdgeTypes = {
   step: StepEdge,
};

const ReactDiagram = forwardRef<ReactDiagramRefType, ReactDiagramProps>(
   (
      {
         id,
         // DiagramView props
         panning = true,
         minZoom = 0.5,
         maxZoom = 2,
         translateExtent = infiniteExtent,
         defaultViewport = initViewport,

         onlyRenderVisibleElements = false,
         disableKeyboardA11y = false,
         noDragClassName = 'nodrag',
         noPanClassName = 'nopan',
         nodeOrigin = initNodeOrigin,
         nodeTypes = defaultNodeTypes,
         onNodeClick,
         onNodeDoubleClick,
         onNodeMouseEnter,
         onNodeMouseMove,

         edgeTypes = defaultEdgeTypes,

         onEdgeUpdate,
         onEdgeUpdateStart,
         onEdgeUpdateEnd,

         onMove,
         onMoveStart,
         onMoveEnd,

         // StoreUpdater props
         nodes,
         edges,
         nodesDraggable,
         elevateNodesOnSelect,
         autoPanOnNodeDrag,
         autoPanOnConnect,
         onNodesChange,
         onNodeDrag,
         onNodeDragStart,
         onNodeDragEnd,

         onEdgesChange,
         onConnect,
         onConnectStart,
         onConnectEnd,
      },
      ref,
   ) => {
      const rfId = id || '1';
      const nodeTypesWrapped = useNodeOrEdgeTypes(nodeTypes, createNodeTypes);
      const edgeTypesWrapped = useNodeOrEdgeTypes(edgeTypes, createEdgeTypes);

      return (
         <div ref={ref} className="react-diagram">
            <Wrapper>
               <DiagramView
                  rfId={rfId}
                  panning={panning}
                  minZoom={minZoom}
                  maxZoom={maxZoom}
                  translateExtent={translateExtent}
                  defaultViewport={defaultViewport}
                  onlyRenderVisibleElements={onlyRenderVisibleElements}
                  disableKeyboardA11y={disableKeyboardA11y}
                  noDragClassName={noDragClassName}
                  noPanClassName={noPanClassName}
                  nodeOrigin={nodeOrigin}
                  nodeTypes={nodeTypesWrapped}
                  edgeTypes={edgeTypesWrapped}
                  onNodeClick={onNodeClick}
                  onNodeDoubleClick={onNodeDoubleClick}
                  onNodeMouseEnter={onNodeMouseEnter}
                  onNodeMouseMove={onNodeMouseMove}
                  onEdgeUpdate={onEdgeUpdate}
                  onEdgeUpdateStart={onEdgeUpdateStart}
                  onEdgeUpdateEnd={onEdgeUpdateEnd}
                  onMove={onMove}
                  onMoveStart={onMoveStart}
                  onMoveEnd={onMoveEnd}
               />
               <StoreUpdater
                  rfId={rfId}
                  nodes={nodes}
                  edges={edges}
                  nodesDraggable={nodesDraggable}
                  elevateNodesOnSelect={elevateNodesOnSelect}
                  autoPanOnNodeDrag={autoPanOnNodeDrag}
                  autoPanOnConnect={autoPanOnConnect}
                  onNodesChange={onNodesChange}
                  onNodeDrag={onNodeDrag}
                  onNodeDragStart={onNodeDragStart}
                  onNodeDragEnd={onNodeDragEnd}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onConnectStart={onConnectStart}
                  onConnectEnd={onConnectEnd}
               />
            </Wrapper>
         </div>
      );
   },
);

ReactDiagram.displayName = 'ReactDiagram';

export default ReactDiagram;
