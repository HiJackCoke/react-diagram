import { memo } from 'react';

import DiagramRenderer from '../../container/DiagramRenderer';
import NodeRenderer from '../../container/NodeRenderer';
import EdgeRenderer from '../../container/EdgeRenderer';
import ConnectionLineRenderer from '../ConnectionLineRenderer';

import { ReactDiagramProps } from '../../types';
import { NodeTypesWrapped } from '../NodeRenderer/type';
import { EdgeTypesWrapped } from '../EdgeRenderer/type';

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
         | 'nodeExtent'
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

   multiSelectionKeyCode,
   dragSelectionKeyCode,

   onMove,
   onMoveStart,
   onMoveEnd,

   // NodeRenderer props
   onlyRenderVisibleElements,
   disableKeyboardA11y,
   noDragClassName,
   nodeOrigin,
   nodeExtent,
   nodeTypes,
   onNodeClick,
   onNodeDoubleClick,
   onNodeContextMenu,
   onNodeMouseEnter,
   onNodeMouseMove,
   onNodeMouseLeave,

   // EdgeRenderer props
   edgeTypes,
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

   // ConnectionLineWrapper
   ConnectionLineContainerStyle,
   ConnectionLineComponent,
}: DiagramViewProps) {
   return (
      <DiagramRenderer
         multiSelectionKeyCode={multiSelectionKeyCode}
         dragSelectionKeyCode={dragSelectionKeyCode}
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
            nodeExtent={nodeExtent}
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
            edgeUpdaterRadius={edgeUpdaterRadius}
            onEdgeClick={onEdgeClick}
            onEdgeDoubleClick={onEdgeDoubleClick}
            onEdgeContextMenu={onEdgeContextMenu}
            onEdgeMouseEnter={onEdgeMouseEnter}
            onEdgeMouseMove={onEdgeMouseMove}
            onEdgeMouseLeave={onEdgeMouseLeave}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
         />
         <ConnectionLineRenderer
            edgeTypes={edgeTypes}
            containerStyle={ConnectionLineContainerStyle}
            component={ConnectionLineComponent}
         />
      </DiagramRenderer>
   );
}

DiagramView.displayName = 'DiagramView';

export default memo(DiagramView);
