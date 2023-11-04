import { Rect } from '../../types';

export type SelectionRect = Rect & {
   startX: number;
   startY: number;
};

function DragBox({ selectionRect }: { selectionRect: SelectionRect | null }) {
   const isActive = selectionRect;

   if (!isActive) {
      return null;
   }

   return (
      <div
         className="react-diagram__drag-box react-diagram__container"
         style={{
            width: selectionRect.width,
            height: selectionRect.height,
            transform: `translate(${selectionRect.x}px, ${selectionRect.y}px)`,
         }}
      />
   );
}

export default DragBox;
