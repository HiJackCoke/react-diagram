import type { DragEvent } from 'react';
import './style.css';

function Sidebar() {
   const onDragStart =
      (nodeType: string) => (event: DragEvent<HTMLDivElement>) => {
         event.dataTransfer.setData(
            'application/react-cosmos-diagram',
            nodeType,
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
