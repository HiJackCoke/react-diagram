import { Rect } from '../../types';

export type DragBoxRect = Rect & {
   startX: number;
   startY: number;
};

function DragBox({ rect }: { rect: DragBoxRect | null }) {
   const isActive = rect;

   if (!isActive) {
      return null;
   }

   return (
      <div
         className="react-diagram__drag-box react-diagram__container"
         style={{
            width: rect.width,
            height: rect.height,
            transform: `translate(${rect.x}px, ${rect.y}px)`,
         }}
      />
   );
}

export default DragBox;
