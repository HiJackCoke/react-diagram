import { memo, useRef } from 'react';
import cc from 'classcat';

import { SelectionBoxRect } from './type';

function SelectionBox({ rect }: { rect: SelectionBoxRect | null }) {
   const nodeRef = useRef<HTMLDivElement>(null);

   const isActive = rect;

   if (!isActive) {
      return null;
   }

   const { width, height, x, y } = rect;

   if (!width || !height) {
      return null;
   }

   return (
      <div
         className={cc([
            'react-diagram__selection-box',
            'react-diagram__container',
         ])}
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
