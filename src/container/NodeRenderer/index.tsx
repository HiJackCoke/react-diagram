import { memo, useEffect, useMemo, useRef } from 'react';
import type { ComponentType } from 'react';

import { shallow } from 'zustand/shallow';

import { useStore } from 'hooks/useStore';
import useVisibleNodes from 'hooks/useVisibleNodes';

import { Position } from 'types';
import { ReactDiagramState } from 'components/ReactDiagramProvider/type';
import { WrapNodeProps } from 'components/Node/type';

import { NodeRendererProps } from './type';

const selector = (s: ReactDiagramState) => ({
   updateNodeDimensions: s.updateNodeDimensions,
});

function NodeRenderer(props: NodeRendererProps) {
   const { updateNodeDimensions } = useStore(selector, shallow);
   const nodes = useVisibleNodes();

   const resizeObserverRef = useRef<ResizeObserver>();

   const resizeObserver = useMemo(() => {
      if (typeof ResizeObserver === 'undefined') {
         return null;
      }

      const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
         const updates = entries.map((entry: ResizeObserverEntry) => ({
            id: entry.target.getAttribute('data-id') as string,
            nodeElement: entry.target as HTMLDivElement,
            forceUpdate: true,
         }));

         updateNodeDimensions(updates);
      });

      resizeObserverRef.current = observer;

      return observer;
   }, []);

   useEffect(
      () => () => {
         resizeObserverRef?.current?.disconnect();
      },
      [],
   );

   return (
      <div className="react-diagram__nodes">
         {nodes.map((node) => {
            let nodeType = node.type || 'default';

            const NodeComponent = (props.nodeTypes[nodeType] ||
               props.nodeTypes.default) as ComponentType<WrapNodeProps>;

            const posX = node.position?.x ?? 0;
            const posY = node.position?.y ?? 0;

            return (
               <NodeComponent
                  {...props}
                  key={node.id}
                  id={node.id}
                  className={node.className}
                  style={node.style}
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
                  resizeObserver={resizeObserver}
                  isParent={true}
                  initialized={true}
                  ariaLabel="label"
               />
            );
         })}
      </div>
   );
}

NodeRenderer.displayName = 'NodeRenderer';

export default memo(NodeRenderer);
