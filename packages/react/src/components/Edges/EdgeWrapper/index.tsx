import { memo, useMemo, useRef, useState } from 'react';
import type { ComponentType, MouseEvent as ReactMouseEvent } from 'react';
import cc from 'classcat';
import { StoreApi } from 'zustand';
import { Connection, PortType, CosmosPort, getMarkerId } from 'cosmos-diagram';

import { useStoreApi } from '../../../hooks/useStore';
import { ARIA_EDGE_DESC_KEY } from '../../../components/A11yDescriptions';

import Anchor from '../Anchor';

import { ReactDiagramState } from '../../ReactDiagramProvider/type';

import { Edge, EdgeProps } from '../type';

import { EdgeWrapperProps, WrapEdgeProps } from '../EdgeWrapper/type';
import { Node } from '../../Node/type';

export function getMouseHandler<EdgeType extends Edge = Edge>(
   id: string,
   getState: StoreApi<ReactDiagramState<Node, EdgeType>>['getState'],
   handler?: (
      event: ReactMouseEvent<SVGGElement, MouseEvent>,
      edge: EdgeType,
   ) => void,
) {
   return handler === undefined
      ? handler
      : (event: ReactMouseEvent<SVGGElement, MouseEvent>) => {
           const edge = getState().edges.find((e) => e.id === id);

           if (edge) {
              handler(event, { ...edge });
           }
        };
}

const wrapEdge = <EdgeType extends Edge = Edge>(
   EdgeComponent: ComponentType<EdgeProps<EdgeType>>,
): EdgeWrapperProps<EdgeType> => {
   const EdgeWrapper = (props: WrapEdgeProps<EdgeType>): JSX.Element | null => {
      const {
         id,
         className,
         style,
         type,
         data,
         rfId,
         ariaLabel,

         // sourceAndTargetIds
         source,
         sourcePort,
         target,
         targetPort,

         // marker
         markerEnd,
         markerStart,

         // labelProps
         label,
         labelStyle,
         labelShowBg,
         labelBgStyle,
         labelBgPadding,
         labelBgBorderRadius,

         // AnchorProps
         edgeUpdaterRadius,

         // position
         sourceX,
         sourceY,
         targetX,
         targetY,
         sourcePosition,
         targetPosition,

         hidden,
         selected,
         // isFocusable,
         // isSelectable,
         focusable = true,
         selectable = true,
         elementsSelectable,

         onClick,
         onDoubleClick,
         onContextMenu,
         onMouseEnter,
         onMouseMove,
         onMouseLeave,
         onEdgeUpdate,
         onEdgeUpdateStart,
         onEdgeUpdateEnd,
      } = props;

      const position = {
         sourceX,
         sourceY,
         targetX,
         targetY,
         sourcePosition,
         targetPosition,
      };

      const sourceAndTargetIds = {
         source,
         sourcePort,
         target,
         targetPort,
      };

      const isSelectable = !!(
         selectable ||
         (elementsSelectable && typeof selectable === 'undefined')
      );

      const isConnecting = className === 'react-diagram__connection';

      if (isConnecting) {
         document
            .querySelector('path')
            ?.classList.add('react-diagram__connection-path');

         return (
            <EdgeComponent
               {...sourceAndTargetIds}
               {...position}
               id={id}
               data={data}
               style={style}
               selected={selected}
            />
         );
      }

      const store = useStoreApi<Node, EdgeType>();

      const edgeRef = useRef<SVGGElement>(null);
      const [updating, setUpdating] = useState(false);

      const markerStartUrl = useMemo(
         () => `url(#${getMarkerId(markerStart, rfId)})`,
         [markerStart, rfId],
      );
      const markerEndUrl = useMemo(
         () => `url(#${getMarkerId(markerEnd, rfId)})`,
         [markerEnd, rfId],
      );

      if (hidden) {
         return null;
      }

      const handleEdgeUpdater =
         (fromPortType: PortType) =>
         (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
            if (event.button !== 0) {
               return;
            }

            const {
               edges,
               domNode,
               autoPanOnConnect,
               connectionRadius,
               transform,
               getNodes,
               cancelConnection,
               updateConnection,
               onConnectStart,
               onConnectEnd,
               panBy,
            } = store.getState();

            const nodeId = props[fromPortType];
            const edge = edges.find((e) => e.id === id)!;
            const portId =
               (fromPortType === 'source' ? sourcePort : targetPort) || null;

            setUpdating(true);
            onEdgeUpdateStart?.(event, edge, fromPortType);

            const onConnectEdge = (connection: Connection) =>
               onEdgeUpdate?.(edge, connection);

            const handleEdgeUpdateEnd = (evt: MouseEvent | TouchEvent) => {
               setUpdating(false);
               onEdgeUpdateEnd?.(
                  evt as unknown as ReactMouseEvent,
                  edge,
                  fromPortType,
               );
            };

            CosmosPort.onPointerDown({
               isAnchor: true,
               event: event.nativeEvent,
               nodeId,
               portId,
               portType: fromPortType,
               domNode,
               autoPanOnConnect,
               connectionRadius,
               nodes: getNodes(),
               onEdgeUpdateEnd: handleEdgeUpdateEnd,
               cancelConnection,
               updateConnection,
               onConnect: onConnectEdge,
               onConnectStart,
               onConnectEnd,
               panBy,
               getTransform: () => transform,
            });
         };

      const onEdgeClick = (
         event: React.MouseEvent<SVGGElement, MouseEvent>,
      ): void => {
         const {
            edges,
            multiSelectionActive,
            addSelectedEdges,
            unselectEdges,
         } = store.getState();

         if (isSelectable) {
            const selectedEdge = edges.filter((edge) => edge.id === id);

            if (!selected) {
               addSelectedEdges([id]);
            } else if (selected && multiSelectionActive) {
               unselectEdges({ edges: [...selectedEdge] });

               edgeRef.current?.blur();
            }
         }

         if (onClick) {
            const edge = edges.find((e) => e.id === id)!;
            onClick(event, edge);
         }
      };

      const onEdgeDoubleClick = getMouseHandler(
         id,
         store.getState,
         onDoubleClick,
      );

      const onEdgeContextMenu = getMouseHandler(
         id,
         store.getState,
         onContextMenu,
      );

      const onEdgeMouseEnter = getMouseHandler(
         id,
         store.getState,
         onMouseEnter,
      );

      const onEdgeMouseMove = getMouseHandler(id, store.getState, onMouseMove);

      const onEdgeMouseLeave = getMouseHandler(
         id,
         store.getState,
         onMouseLeave,
      );

      const inactive = !elementsSelectable;

      const wrapperClassName = cc([
         'react-diagram__edge',
         `react-diagram__edge-${type}`,
         className,
         { selected, inactive },
      ]);

      const marker = { markerStart: markerStartUrl, markerEnd: markerEndUrl };

      const labelProps = {
         label,
         labelStyle,
         labelShowBg,
         labelBgStyle,
         labelBgPadding,
         labelBgBorderRadius,
      };

      const events = {
         onClick: onEdgeClick,
         onDoubleClick: onEdgeDoubleClick,
         onContextMenu: onEdgeContextMenu,
         onMouseEnter: onEdgeMouseEnter,
         onMouseMove: onEdgeMouseMove,
         onMouseLeave: onEdgeMouseLeave,
      };

      return (
         <g
            {...events}
            ref={edgeRef}
            className={wrapperClassName}
            tabIndex={focusable ? 0 : undefined}
            role={focusable ? 'button' : undefined}
            aria-label={
               ariaLabel === null
                  ? undefined
                  : ariaLabel
                  ? ariaLabel
                  : `Edge from ${source} to ${target}`
            }
            aria-describedby={
               focusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : undefined
            }
         >
            {!updating && (
               <>
                  <EdgeComponent
                     {...sourceAndTargetIds}
                     {...marker}
                     {...labelProps}
                     {...position}
                     id={id}
                     data={data}
                     style={style}
                     selected={selected}
                  />

                  <Anchor
                     position={sourcePosition}
                     centerX={sourceX}
                     centerY={sourceY}
                     radius={edgeUpdaterRadius}
                     onMouseDown={handleEdgeUpdater('target')}
                     // onMouseEnter={console.log}
                     // onMouseOut={console.log}
                     type="source"
                  />

                  <Anchor
                     position={targetPosition}
                     centerX={targetX}
                     centerY={targetY}
                     radius={edgeUpdaterRadius}
                     onMouseDown={handleEdgeUpdater('source')}
                     // onMouseEnter={console.log}
                     // onMouseOut={console.log}
                     type="target"
                  />
               </>
            )}
         </g>
      );
   };
   EdgeWrapper.displayName = 'EdgeWrapper';
   return memo(EdgeWrapper) as EdgeWrapperProps<EdgeType>;
};

export default wrapEdge;
