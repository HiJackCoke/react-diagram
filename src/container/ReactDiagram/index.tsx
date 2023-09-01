import { forwardRef } from 'react';

import DiagramView from './DiagramView';
import StoreUpdater from 'components/StoreUpdater';

import { infiniteExtent } from 'store/initialState';

import { useNodeOrEdgeTypes } from 'hooks/useNodeOrEdgeTypes';

import Nodes from 'components/Node';
import StepEdge from 'components/Edges/StepEdge';

import { createNodeTypes } from 'container/NodeRenderer/utils';
import { createEdgeTypes } from 'container/EdgeRenderer/utils';

import {
   ReactDiagramRefType,
   ReactDiagramProps,
   Viewport,
   NodeOrigin,
   NodeTypes,
   EdgeTypes,
} from 'types';

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

         edgeTypes = defaultEdgeTypes,

         // StoreUpdater props
         nodes,
         edges,
         nodesDraggable,
         elevateNodesOnSelect,
         onNodesChange,
         onEdgesChange,
      },
      ref,
   ) => {
      const rfId = id || '1';
      const nodeTypesWrapped = useNodeOrEdgeTypes(nodeTypes, createNodeTypes);
      const edgeTypesWrapped = useNodeOrEdgeTypes(edgeTypes, createEdgeTypes);

      return (
         <div ref={ref} className="react-diagram">
            <DiagramView
               rfId={rfId}
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
            />
            <StoreUpdater
               rfId={rfId}
               nodes={nodes}
               edges={edges}
               nodesDraggable={nodesDraggable}
               elevateNodesOnSelect={elevateNodesOnSelect}
               onNodesChange={onNodesChange}
               onEdgesChange={onEdgesChange}
            />
         </div>
      );
   },
);

ReactDiagram.displayName = 'ReactDiagram';

export default ReactDiagram;
