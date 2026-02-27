import { memo } from 'react';

import DiagramRenderer from '../../container/DiagramRenderer';
import NodeRenderer from '../../container/NodeRenderer';
import EdgeRenderer from '../../container/EdgeRenderer';
import ConnectionLineRenderer from '../ConnectionLineRenderer';

import { Edge, Node, ReactDiagramProps } from '../../types';
import { NodeTypesWrapped } from '../NodeRenderer/type';
import { EdgeTypesWrapped } from '../EdgeRenderer/type';

export type ReactDiagramCommonProps<
   NodeType extends Node = Node,
   EdgeType extends Edge = Edge,
> = Omit<
   ReactDiagramProps<NodeType, EdgeType>,
   'nodes' | 'edges' | 'nodeTypes' | 'edgeTypes'
>;

export type DiagramViewProps<
   NodeType extends Node = Node,
   EdgeType extends Edge = Edge,
> = ReactDiagramCommonProps<NodeType, EdgeType> &
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
      nodeTypes: NodeTypesWrapped<NodeType>;
      edgeTypes: EdgeTypesWrapped<EdgeType>;
      rfId: string;
   };

function DiagramView<
   NodeType extends Node = Node,
   EdgeType extends Edge = Edge,
>({
   rfId,

   // DiagramRenderer props

   noPanClassName,
   panning,

   defaultViewport,

   multiSelectionKeyCode,
   dragSelectionKeyCode,

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

   onMove,
   onMoveStart,
   onMoveEnd,
   onPaneClick,
   onPaneMouseEnter,
   onPaneMouseMove,
   onPaneMouseLeave,

   // ConnectionLineWrapper
   ConnectionLineContainerStyle,
   ConnectionLineComponent,
}: DiagramViewProps<NodeType, EdgeType>) {
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
         onPaneClick={onPaneClick}
         onPaneMouseEnter={onPaneMouseEnter}
         onPaneMouseMove={onPaneMouseMove}
         onPaneMouseLeave={onPaneMouseLeave}
      >
         <NodeRenderer<NodeType>
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
         <EdgeRenderer<EdgeType>
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
         <ConnectionLineRenderer<EdgeType>
            edgeTypes={edgeTypes}
            containerStyle={ConnectionLineContainerStyle}
            component={ConnectionLineComponent}
         />
      </DiagramRenderer>
   );
}

DiagramView.displayName = 'DiagramView';

export default memo(DiagramView) as typeof DiagramView;
