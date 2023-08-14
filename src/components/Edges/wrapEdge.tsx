import { memo, useMemo, useRef } from 'react';
import type { ComponentType } from 'react';
import cc from 'classcat';

import { ARIA_EDGE_DESC_KEY } from '../A11yDescriptions';

import { getMarkerId } from 'utils/graph';

import { EdgeProps, WrapEdgeProps } from './type';

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
      sourceHandle,
      target,
      targetHandle,

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
      const sourceAndTargetIds = {
         source,
         sourceHandle,
         target,
         targetHandle,
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

      const edgeRef = useRef<SVGGElement>(null);

      const markerStartUrl = useMemo(
         () => `url(#${getMarkerId(markerStart, rfId)})`,
         [markerStart, rfId],
      );
      const markerEndUrl = useMemo(
         () => `url(#${getMarkerId(markerEnd, rfId)})`,
         [markerEnd, rfId],
      );

      const marker = { markerStart: markerStartUrl, markerEnd: markerEndUrl };

      if (hidden) {
         return null;
      }

      const inactive = !elementsSelectable;

      return (
         <g
            className={cc([
               'react-diagram__edge',
               `react-diagram__edge-${type}`,
               className,
               { selected, inactive },
            ])}
            tabIndex={isFocusable ? 0 : undefined}
            role={isFocusable ? 'button' : undefined}
            data-testid={`rf__edge-${id}`}
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
            ref={edgeRef}
         >
            <EdgeComponent
               id={id}
               data={data}
               style={style}
               {...sourceAndTargetIds}
               {...marker}
               {...labelProps}
               {...position}
               selected={selected}
            />
         </g>
      );
   };

   EdgeWrapper.displayName = 'EdgeWrapper';

   return memo(EdgeWrapper);
};

export default wrapEdge;
