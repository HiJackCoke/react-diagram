import { memo, useMemo, useRef } from 'react';
import type { ComponentType } from 'react';
import cc from 'classcat';

import { ARIA_EDGE_DESC_KEY } from '../A11yDescriptions';

import { getMarkerId } from '../../utils/graph';

import { EdgeProps, WrapEdgeProps } from './type';

export default (EdgeComponent: ComponentType<EdgeProps>) => {
   const EdgeWrapper = ({
      id,
      className,
      type,
      data,

      selected,

      style,
      source,
      target,
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      elementsSelectable,
      hidden,
      sourceHandleId,
      targetHandleId,

      markerEnd,
      markerStart,
      rfId,
      ariaLabel,
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
               source={source}
               target={target}
               selected={selected}
               data={data}
               style={style}
               sourceX={sourceX}
               sourceY={sourceY}
               targetX={targetX}
               targetY={targetY}
               sourcePosition={sourcePosition}
               targetPosition={targetPosition}
               sourceHandleId={sourceHandleId}
               targetHandleId={targetHandleId}
               markerStart={markerStartUrl}
               markerEnd={markerEndUrl}
            />
         </g>
      );
   };

   EdgeWrapper.displayName = 'EdgeWrapper';

   return memo(EdgeWrapper);
};
