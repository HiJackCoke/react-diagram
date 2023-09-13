import { memo, useMemo, useRef } from 'react';
import type { ComponentType } from 'react';
import cc from 'classcat';

import { ARIA_EDGE_DESC_KEY } from '../A11yDescriptions';

import { getMarkerId } from 'utils/graph';

import { EdgeProps, WrapEdgeProps } from './type';
import Anchor from './Anchor';

const wrapEdge = (EdgeComponent: ComponentType<EdgeProps>) => {
   const EdgeWrapper = ({
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
   }: WrapEdgeProps): JSX.Element | null => {
      const edgeRef = useRef<SVGGElement>(null);

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
               onMouseDown={console.log}
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
