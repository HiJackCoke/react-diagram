import { ComponentType } from 'react';

import wrapNode from 'components/Node/wrapNode';
import Nodes from 'components/Node';

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

const nodes = [
   {
      id: '1',
      data: { label: 'An input node' },
      position: { x: 0, y: 50 },
   },
   {
      id: '2',
      data: { label: 'Output A' },
      position: { x: 300, y: 50 },
   },
   {
      id: '3',
      data: { label: 'Output A' },
      position: { x: 650, y: 25 },
   },
   {
      id: '4',
      data: { label: 'Output B' },
      position: { x: 650, y: 100 },
   },
];

const defaultNodeTypes: NodeTypes = {
   default: Nodes,
};

function NodeRenderer(props: NodeRendererProps) {
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
