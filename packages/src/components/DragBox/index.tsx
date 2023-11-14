import { Rect } from '../../types';

function DragBox({ rect }: { rect: Rect }) {
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
