import { ComponentType, MemoExoticComponent } from 'react';

import { WrapNodeProps, NodeProps } from 'components/Node/type';
import { ReactDiagramProps } from 'types';

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

export type NodeTypes = { [key: string]: ComponentType<NodeProps> };
export type NodeTypesWrapped = {
   [key: string]: MemoExoticComponent<ComponentType<WrapNodeProps>>;
};
export type CreateNodeTypes = (nodeTypes: NodeTypes) => NodeTypesWrapped;
