import { memo, useRef } from 'react';
import cc from 'classcat';

import useDrag from '../../hooks/useDrag';

import { Rect } from '@diagram/core';

function SelectionBox({ rect, transform }: { rect: Rect; transform: string }) {
   const nodeRef = useRef<HTMLDivElement>(null);

   useDrag({ nodeRef });

   const { width, height, x, y } = rect;

   return (
      <div
         className={cc([
            'react-diagram__selection-box',
            'react-diagram__container',
         ])}
         style={{
            transform,
         }}
      >
         <div
            ref={nodeRef}
            className="react-diagram__selection-box-rect"
            tabIndex={-1}
            style={{
               width,
               height,
               top: y,
               left: x,
            }}
         />
      </div>
   );
}

export default memo(SelectionBox);
