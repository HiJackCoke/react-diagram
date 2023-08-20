import { memo, useEffect, useMemo, useRef } from 'react';
import type { ComponentType } from 'react';

import { shallow } from 'zustand/shallow';

import { useStore } from 'hooks/useStore';
import useVisibleNodes from 'hooks/useVisibleNodes';

import { internalsSymbol } from 'utils';

import { Position, ReactDiagramProps } from 'types';
import { ReactDiagramState } from 'components/ReactDiagramProvider/type';
import { WrapNodeProps } from 'components/Node/type';
import { NodeTypesWrapped } from './type';

type RequiredProps = Required<
   Pick<
      ReactDiagramProps,
      'onlyRenderVisibleElements' | 'disableKeyboardA11y' | 'nodeOrigin'
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
      nodeTypes: NodeTypesWrapped;
      rfId: string;
   };

const selector = (s: ReactDiagramState) => ({
   updateNodeDimensions: s.updateNodeDimensions,
   nodesDraggable: s.nodesDraggable,
   elementsSelectable: s.elementsSelectable,
});

function NodeRenderer({
   nodeTypes,
   onNodeClick,
   onNodeMouseEnter,
   onNodeMouseMove,
   onNodeMouseLeave,
   onNodeContextMenu,
   onNodeDoubleClick,
   ...props
}: NodeRendererProps) {
   const { nodesDraggable, elementsSelectable, updateNodeDimensions } =
      useStore(selector, shallow);
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
            const {
               data,
               type,
               // elProps
               id,
               className,
               style,
               ariaLabel,

               positionAbsolute,

               hidden,
               selected,
               selectable,
               draggable,
            } = node;

            let nodeType = type || 'default';

            const NodeComponent = (nodeTypes[nodeType] ||
               nodeTypes.default) as ComponentType<WrapNodeProps>;

            const isDraggable = !!(
               draggable ||
               (nodesDraggable && typeof draggable === 'undefined')
            );
            const isSelectable = !!(
               selectable ||
               (elementsSelectable && typeof selectable === 'undefined')
            );

            const elProps = {
               key: id,
               id,
               className,
               style,
               ariaLabel,
            };

            const events = {
               onClick: onNodeClick,
               onMouseEnter: onNodeMouseEnter,
               onMouseMove: onNodeMouseMove,
               onMouseLeave: onNodeMouseLeave,
               onContextMenu: onNodeContextMenu,
               onDoubleClick: onNodeDoubleClick,
            };

            const position = {
               positionX: positionAbsolute?.x || 0,
               positionY: positionAbsolute?.y || 0,
               sourcePosition: Position.Bottom,
               targetPosition: Position.Top,
            };

            const booleanProps = {
               selected: !!selected,
               isSelectable,
               isDraggable,
               hidden,
               isParent: !!node[internalsSymbol]?.isParent,
               initialized: !!node.width && !!node.height,
            };

            return (
               <NodeComponent
                  {...props}
                  {...elProps}
                  {...position}
                  {...events}
                  {...booleanProps}
                  zIndex={node[internalsSymbol]?.z ?? 0}
                  type={nodeType}
                  data={data}
                  resizeObserver={resizeObserver}
               />
            );
         })}
      </div>
   );
}

NodeRenderer.displayName = 'NodeRenderer';

export default memo(NodeRenderer);
