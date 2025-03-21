import { HTMLAttributes } from 'react';

const PuzzleNodeView = ({
   children,
   draggable,
   onDragStart,
}: HTMLAttributes<HTMLDivElement>) => {
   return (
      <div draggable={draggable} onDragStart={onDragStart}>
         <div>{children}</div>
      </div>
   );
};

export default PuzzleNodeView;
