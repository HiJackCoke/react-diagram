import { memo } from 'react';

import DiagramRenderer from '../../container/DiagramRenderer';
import NodeRenderer from '../../container/NodeRenderer';
import EdgeRenderer from '../../container/EdgeRenderer';

import {
   ReactDiagramProps,
   NodeTypesWrapped,
   EdgeTypesWrapped,
} from '../../types';
import ConnectionLineWrapper from '../../components/ConnectionEdge';

export type ReactDiagramCommonProps = Omit<
   ReactDiagramProps,
   'nodes' | 'edges' | 'nodeTypes' | 'edgeTypes'
>;

export type DiagramViewProps = ReactDiagramCommonProps &
   Required<
      Pick<
         ReactDiagramProps,
         | 'panning'
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
   onNodeContextMenu,
   onNodeMouseEnter,
   onNodeMouseMove,
   onNodeMouseLeave,

   // EdgeRenderer props
   edgeTypes,
   onEdgeClick,
   onEdgeDoubleClick,
   onEdgeContextMenu,
   onEdgeMouseEnter,
   onEdgeMouseMove,
   onEdgeMouseLeave,
   onEdgeUpdate,
   onEdgeUpdateStart,
   onEdgeUpdateEnd,
}: DiagramViewProps) {
   return (
      <DiagramRenderer
         noPanClassName={noPanClassName}
         panning={panning}
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
            onNodeContextMenu={onNodeContextMenu}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseMove={onNodeMouseMove}
            onNodeMouseLeave={onNodeMouseLeave}
         />
         <EdgeRenderer
            rfId={rfId}
            edgeTypes={edgeTypes}
            noPanClassName={noPanClassName}
            onEdgeClick={onEdgeClick}
            onEdgeDoubleClick={onEdgeDoubleClick}
            onEdgeContextMenu={onEdgeContextMenu}
            onEdgeMouseEnter={onEdgeMouseEnter}
            onEdgeMouseMove={onEdgeMouseMove}
            onEdgeMouseLeave={onEdgeMouseLeave}
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
