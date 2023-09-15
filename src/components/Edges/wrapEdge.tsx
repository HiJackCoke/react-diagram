import { memo, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import cc from 'classcat';

import { useStoreApi } from 'hooks/useStore';
import { ARIA_EDGE_DESC_KEY } from 'components/A11yDescriptions';
import { handlePointerDown } from 'components/Port/utils';
import Anchor from './Anchor';

import { getMarkerId } from 'utils/graph';

import { PortType } from 'types';

import { EdgeProps, WrapEdgeProps } from './type';

const wrapEdge = (EdgeComponent: ComponentType<EdgeProps>) => {
   const EdgeWrapper = (props: WrapEdgeProps): JSX.Element | null => {
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

         // position
         sourceX,
         sourceY,
         targetX,
         targetY,
         sourcePosition,
         targetPosition,

         selected,
         elementsSelectable,
         hidden,
         isFocusable,
      } = props;

      const edgeRef = useRef<SVGGElement>(null);
      const [updating, setUpdating] = useState(false);
      const store = useStoreApi();

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

            const nodeId = props[fromPortType];

            setUpdating(true);

            const onEdgeUpdateEnd = (event: MouseEvent | TouchEvent) => {
               setUpdating(false);
               console.log(event);
            };

            handlePointerDown({
               isAnchor: true,
               event,
               nodeId,
               portType: fromPortType,
               getState: store.getState,
               setState: store.setState,
               onConnect: console.log,
               onEdgeUpdateEnd,
            });
         };

      const inactive = !elementsSelectable;

      const wrapperClassName = cc([
         'react-diagram__edge',
         `react-diagram__edge-${type}`,
         className,
         { selected, inactive },
      ]);

      const marker = { markerStart: markerStartUrl, markerEnd: markerEndUrl };

      const sourceAndTargetIds = {
         source,
         sourcePort,
         target,
         targetPort,
      };

      const labelProps = {
         label,
         labelStyle,
         labelShowBg,
         labelBgStyle,
         labelBgPadding,
         labelBgBorderRadius,
      };

      const position = {
         sourceX,
         sourceY,
         targetX,
         targetY,
         sourcePosition,
         targetPosition,
      };

      return (
         <g
            ref={edgeRef}
            className={wrapperClassName}
            tabIndex={isFocusable ? 0 : undefined}
            role={isFocusable ? 'button' : undefined}
            aria-label={
               ariaLabel === null
                  ? undefined
                  : ariaLabel
                  ? ariaLabel
                  : `Edge from ${source} to ${target}`
            }
            aria-describedby={
               isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : undefined
            }
         >
            {!updating && (
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
            )}

            <Anchor
               position={sourcePosition}
               centerX={sourceX}
               centerY={sourceY}
               radius={10}
               onMouseDown={console.log}
               onMouseEnter={console.log}
               onMouseOut={console.log}
               type="source"
            />

            <Anchor
               position={targetPosition}
               centerX={targetX}
               centerY={targetY}
               radius={10}
               onMouseDown={handleEdgeUpdater('source')}
               onMouseEnter={console.log}
               onMouseOut={console.log}
               type="target"
            />
         </g>
      );
   };

   EdgeWrapper.displayName = 'EdgeWrapper';
   return memo(EdgeWrapper);
};

export default wrapEdge;
