import { DragBoxRect } from './type';

function DragBox({ rect }: { rect: DragBoxRect | null }) {
   const isActive = rect;

   if (!isActive) {
      return null;
   }

   const { width, height, x, y } = rect;

   return (
      <div
         className="react-diagram__drag-box react-diagram__container"
         style={{
            width,
            height,
            transform: `translate(${x}px, ${y}px)`,
         }}
      />
   );
}

export default DragBox;
