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

   // NodeRenderer props
   onlyRenderVisibleElements,
   disableKeyboardA11y,
   noDragClassName,
   nodeOrigin,
   nodeTypes,
   onNodeClick,

   // EdgeRenderer props
   edgeTypes,
}: DiagramViewProps) {
   return (
      <DiagramRenderer
         noPanClassName={noPanClassName}
         panning={panning}
         minZoom={minZoom}
         maxZoom={maxZoom}
         translateExtent={translateExtent}
         defaultViewport={defaultViewport}
      >
         <NodeRenderer
            rfId={rfId}
            nodeTypes={nodeTypes}
            onlyRenderVisibleElements={onlyRenderVisibleElements}
            disableKeyboardA11y={disableKeyboardA11y}
            nodeOrigin={nodeOrigin}
            onNodeClick={onNodeClick}
            noDragClassName={noDragClassName}
            noPanClassName={noPanClassName}
         />
         <EdgeRenderer edgeTypes={edgeTypes} rfId={rfId}>
            <ConnectionLineWrapper />
         </EdgeRenderer>
         <div className="react-diagram__edgelabel-renderer" />
      </DiagramRenderer>
   );
}

export default DiagramView;
