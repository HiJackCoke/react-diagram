import { ComponentType } from 'react';

import wrapNode from 'components/Node/wrapNode';
import Nodes from 'components/Node';

import useVisibleNodes from 'hooks/useVisibleNodes';

import {
   NodeProps,
   NodeTypes,
   NodeTypesWrapped,
   Position,
   ReactDiagramProps,
} from 'types';

type RequiredProps = Required<
   Pick<
      ReactDiagramProps,
      | 'onlyRenderVisibleElements'
      | 'selectNodesOnDrag'
      | 'disableKeyboardA11y'
      | 'nodeOrigin'
   >
>;

type NodeRendererProps = Pick<
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
      // nodeTypes: NodeTypesWrapped;
      rfId: string;
   };

export type CreateNodeTypes = (nodeTypes: NodeTypes) => NodeTypesWrapped;
export function createNodeTypes(nodeTypes: NodeTypes): NodeTypesWrapped {
   const standardTypes: NodeTypesWrapped = {
      default: wrapNode(
         (nodeTypes.default || Nodes) as ComponentType<NodeProps>,
      ),
   };

   return standardTypes;
}

const defaultNodeTypes: NodeTypes = {
   default: Nodes,
};

function NodeRenderer(props: NodeRendererProps) {
   const nodes = useVisibleNodes();

   return (
      <div className="react-diagram__nodes">
         {nodes.map((node) => {
            const NodeComponent = createNodeTypes(defaultNodeTypes).default;

            const posX = node.position?.x ?? 0;
            const posY = node.position?.y ?? 0;

            return (
               <NodeComponent
                  {...props}
                  key={node.id}
                  id={node.id}
                  // className={node.className}
                  // style={node.style}
                  onClick={props.onNodeClick}
                  onMouseEnter={props.onNodeMouseEnter}
                  onMouseMove={props.onNodeMouseMove}
                  onMouseLeave={props.onNodeMouseLeave}
                  onContextMenu={props.onNodeContextMenu}
                  onDoubleClick={props.onNodeDoubleClick}
                  type="default"
                  data={node.data}
                  sourcePosition={Position.Bottom}
                  targetPosition={Position.Top}
                  hidden={false}
                  xPos={posX}
                  yPos={posY}
                  xPosOrigin={posX}
                  yPosOrigin={posY}
                  zIndex={0}
                  isParent={true}
                  initialized={true}
                  ariaLabel="label"
               />
            );
         })}
      </div>
   );
}

export default NodeRenderer;
