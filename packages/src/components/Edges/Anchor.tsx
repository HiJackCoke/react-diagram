import { MouseEvent as ReactMouseEvent, SVGAttributes } from 'react';
import cc from 'classcat';

import { Position } from '../../types';

type EventNames = 'onMouseDown' | 'onMouseEnter' | 'onMouseOut';

type AnchorEvents = {
   [H in EventNames]?: (
      event: ReactMouseEvent<SVGGElement, MouseEvent>,
   ) => void;
};

interface AnchorProps extends SVGAttributes<SVGGElement>, AnchorEvents {
   position: Position;
   centerX: number;
   centerY: number;
   radius?: number;
   type: string;
}

const portPositionX = (
   x: number,
   shift: number,
   position: Position,
): number => {
   if (position === Position.Left) return x - shift;
   if (position === Position.Right) return x + shift;
   return x;
};

const portPositionY = (
   y: number,
   shift: number,
   position: Position,
): number => {
   if (position === Position.Top) return y - shift;
   if (position === Position.Bottom) return y + shift;
   return y;
};

const EdgeUpdaterClassName = 'react-diagram__edgeupdater';

function Anchor({
   position,
   centerX,
   centerY,
   radius = 10,
   onMouseDown,
   onMouseEnter,
   onMouseOut,
   type,
}: AnchorProps) {
   return (
      <circle
         className={cc([
            EdgeUpdaterClassName,
            `${EdgeUpdaterClassName}-${type}`,
         ])}
         cx={portPositionX(centerX, radius, position)}
         cy={portPositionY(centerY, radius, position)}
         r={radius}
         stroke="transparent"
         fill="transparent"
         onMouseDown={onMouseDown}
         onMouseEnter={onMouseEnter}
         onMouseOut={onMouseOut}
      />
   );
}

export default Anchor;
