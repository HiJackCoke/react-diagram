import type { DragEvent } from 'react';
import './style.css';

function Sidebar() {
   const onDragStart =
      (nodeType: string) => (event: DragEvent<HTMLDivElement>) => {
         const node = event.target as HTMLDivElement;

         const x = event.clientX - node.offsetLeft;
         const y = event.clientY - node.offsetTop;
         const distance = {
            x,
            y,
         };

         event.dataTransfer.setData(
            'application/react-cosmos-diagram',
            nodeType,
         );
         event.dataTransfer.setData(
            'application/node',
            JSON.stringify(distance),
         );
         event.dataTransfer.effectAllowed = 'move';
      };

   return (
      <aside>
         <div className="description">
            You can drag these nodes to the pane on the right.
         </div>
         <div
            className="dndnode input"
            onDragStart={onDragStart('input')}
            draggable
         >
            Input Node
         </div>
         <div
            className="dndnode"
            onDragStart={onDragStart('default')}
            draggable
         >
            Default Node
         </div>
         <div
            className="dndnode output"
            onDragStart={onDragStart('output')}
            draggable
         >
            Output Node
         </div>
      </aside>
   );
}

export default Sidebar;
