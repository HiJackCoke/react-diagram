import { ReactDiagramProps, NodeTypesWrapped } from 'types';

type RequiredProps = Required<
   Pick<
      ReactDiagramProps,
      | 'onlyRenderVisibleElements'
      | 'selectNodesOnDrag'
      | 'disableKeyboardA11y'
      | 'nodeOrigin'
   >
>;

export type NodeRendererProps = Pick<
   ReactDiagramProps,
   | 'onNodeClick'
   | 'onNodeDoubleClick'
   | 'onNodeMouseEnter'
   | 'onNodeMouseMove'
   | 'onNodeMouseLeave'
   | 'onNodeContextMenu'
   | 'nodeExtent'
> &
   RequiredProps & {
      nodeTypes: NodeTypesWrapped;
      rfId: string;
   };
