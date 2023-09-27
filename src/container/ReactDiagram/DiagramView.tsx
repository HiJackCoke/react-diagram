import { memo } from 'react';

import DiagramRenderer from 'container/DiagramRenderer';
import NodeRenderer from 'container/NodeRenderer';
import EdgeRenderer from 'container/EdgeRenderer';

import { ReactDiagramProps, NodeTypesWrapped, EdgeTypesWrapped } from 'types';
import ConnectionLineWrapper from 'components/ConnectionEdge';

import '../style.css';

export type ReactDiagramCommonProps = Omit<
   ReactDiagramProps,
   'nodes' | 'edges' | 'nodeTypes' | 'edgeTypes'
>;

export type DiagramViewProps = ReactDiagramCommonProps &
   Required<
      Pick<
         ReactDiagramProps,
         | 'panning'
         | 'minZoom'
         | 'maxZoom'
         | 'translateExtent'
         | 'defaultViewport'
         | 'onlyRenderVisibleElements'
         | 'disableKeyboardA11y'
         | 'noDragClassName'
         | 'noPanClassName'
         | 'nodeOrigin'
      >
   > & {
      nodeTypes: NodeTypesWrapped;
      edgeTypes: EdgeTypesWrapped;
      rfId: string;
   };

function DiagramView({
   rfId,

   // DiagramRenderer props
   noPanClassName,
   panning,
   minZoom,
   maxZoom,
   translateExtent,
   defaultViewport,
   onMove,
   onMoveStart,
   onMoveEnd,

   // NodeRenderer props
   onlyRenderVisibleElements,
   disableKeyboardA11y,
   noDragClassName,
   nodeOrigin,
   nodeTypes,
   onNodeClick,
   onNodeDoubleClick,
   onNodeMouseEnter,
   onNodeMouseMove,

   // EdgeRenderer props
   edgeTypes,
   onEdgeUpdate,
   onEdgeUpdateStart,
   onEdgeUpdateEnd,
}: DiagramViewProps) {
   return (
      <DiagramRenderer
         noPanClassName={noPanClassName}
         panning={panning}
         minZoom={minZoom}
         maxZoom={maxZoom}
         translateExtent={translateExtent}
         defaultViewport={defaultViewport}
         onMove={onMove}
         onMoveStart={onMoveStart}
         onMoveEnd={onMoveEnd}
      >
         <NodeRenderer
            rfId={rfId}
            nodeTypes={nodeTypes}
            onlyRenderVisibleElements={onlyRenderVisibleElements}
            disableKeyboardA11y={disableKeyboardA11y}
            nodeOrigin={nodeOrigin}
            noDragClassName={noDragClassName}
            noPanClassName={noPanClassName}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseMove={onNodeMouseMove}
         />
         <EdgeRenderer
            rfId={rfId}
            edgeTypes={edgeTypes}
            noPanClassName={noPanClassName}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
         >
            <ConnectionLineWrapper />
         </EdgeRenderer>
         <div className="react-diagram__edgelabel-renderer" />
      </DiagramRenderer>
   );
}

DiagramView.displayName = 'DiagramView';

export default memo(DiagramView);
