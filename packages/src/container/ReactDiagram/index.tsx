import { forwardRef } from 'react';

import DiagramView from './DiagramView';
import StoreUpdater from '../../components/StoreUpdater';

import { useNodeOrEdgeTypes } from '../../hooks/useNodeOrEdgeTypes';

import Nodes from '../../components/Node';
import StepEdge from '../../components/Edges/StepEdge';

import { createNodeTypes } from '../../container/NodeRenderer/utils';
import { createEdgeTypes } from '../../container/EdgeRenderer/utils';

import Wrapper from './Wrapper';

import { ReactDiagramRefType, ReactDiagramProps, Viewport } from '../../types';
import { NodeTypes } from '../NodeRenderer/type';
import { EdgeTypes } from '../EdgeRenderer/type';
import { NodeOrigin } from '../../components/Node/utils';

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
         children,
         id,
         // DiagramView props
         panning = true,
         minZoom,
         maxZoom,
         translateExtent,
         nodeExtent,
         defaultViewport = initViewport,

         multiSelectionKeyCode,
         dragSelectionKeyCode,

         onlyRenderVisibleElements = false,
         disableKeyboardA11y = false,
         noDragClassName = 'nodrag',
         noPanClassName = 'nopan',
         nodeOrigin = initNodeOrigin,
         nodeTypes = defaultNodeTypes,
         onNodeClick,
         onNodeDoubleClick,
         onNodeContextMenu,
         onNodeMouseEnter,
         onNodeMouseMove,
         onNodeMouseLeave,

         edgeTypes = defaultEdgeTypes,
         edgeUpdaterRadius,
         onEdgeClick,
         onEdgeDoubleClick,
         onEdgeContextMenu,
         onEdgeMouseEnter,
         onEdgeMouseMove,
         onEdgeMouseLeave,
         onEdgeUpdate,
         onEdgeUpdateStart,
         onEdgeUpdateEnd,

         onMove,
         onMoveStart,
         onMoveEnd,

         ConnectionLineContainerStyle,
         ConnectionLineComponent,

         // StoreUpdater props
         nodes,
         edges,
         nodesDraggable,
         elevateNodesOnSelect,
         autoPanOnNodeDrag,
         autoPanOnConnect,
         connectionRadius,
         smoothStep,
         centerStep,
         gridStep,
         onNodesChange,
         onNodeDrag,
         onNodeDragStart,
         onNodeDragEnd,

         onEdgesChange,

         onConnect,
         onConnectStart,
         onConnectEnd,

         onError,
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
                  defaultViewport={defaultViewport}
                  multiSelectionKeyCode={multiSelectionKeyCode}
                  dragSelectionKeyCode={dragSelectionKeyCode}
                  onlyRenderVisibleElements={onlyRenderVisibleElements}
                  disableKeyboardA11y={disableKeyboardA11y}
                  noDragClassName={noDragClassName}
                  noPanClassName={noPanClassName}
                  nodeOrigin={nodeOrigin}
                  nodeTypes={nodeTypesWrapped}
                  edgeTypes={edgeTypesWrapped}
                  edgeUpdaterRadius={edgeUpdaterRadius}
                  ConnectionLineContainerStyle={ConnectionLineContainerStyle}
                  ConnectionLineComponent={ConnectionLineComponent}
                  onNodeClick={onNodeClick}
                  onNodeDoubleClick={onNodeDoubleClick}
                  onNodeContextMenu={onNodeContextMenu}
                  onNodeMouseEnter={onNodeMouseEnter}
                  onNodeMouseMove={onNodeMouseMove}
                  onNodeMouseLeave={onNodeMouseLeave}
                  onEdgeClick={onEdgeClick}
                  onEdgeDoubleClick={onEdgeDoubleClick}
                  onEdgeContextMenu={onEdgeContextMenu}
                  onEdgeMouseEnter={onEdgeMouseEnter}
                  onEdgeMouseMove={onEdgeMouseMove}
                  onEdgeMouseLeave={onEdgeMouseLeave}
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
                  connectionRadius={connectionRadius}
                  nodeExtent={nodeExtent}
                  translateExtent={translateExtent}
                  minZoom={minZoom}
                  maxZoom={maxZoom}
                  smoothStep={smoothStep}
                  centerStep={centerStep}
                  gridStep={gridStep}
                  onNodesChange={onNodesChange}
                  onNodeDrag={onNodeDrag}
                  onNodeDragStart={onNodeDragStart}
                  onNodeDragEnd={onNodeDragEnd}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onConnectStart={onConnectStart}
                  onConnectEnd={onConnectEnd}
                  onError={onError}
               />
               {children}
            </Wrapper>
         </div>
      );
   },
);

ReactDiagram.displayName = 'ReactDiagram';

export default ReactDiagram;
