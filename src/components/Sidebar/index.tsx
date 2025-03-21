import type { DragEvent } from 'react';
import './style.css';
import SidebarNode from 'components/Node/SidebarNode';

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

         const container = event.target as HTMLDivElement;
         const element = container.firstElementChild as HTMLDivElement;

         event.dataTransfer.setData(
            'application/react-cosmos-diagram',
            nodeType,
         );
         event.dataTransfer.setData(
            'application/node',
            JSON.stringify(distance),
         );
         event.dataTransfer.setData('text/plain', element.innerHTML);
         event.dataTransfer.effectAllowed = 'move';
      };

   return (
      <aside>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <SidebarNode
               className="dndnode input"
               onDragStart={onDragStart('custom')}
               draggable
            >
               <input />
            </SidebarNode>

            <SidebarNode
               className="dndnode"
               onDragStart={onDragStart('custom')}
               draggable
            >
               <span>Custom Node</span>
            </SidebarNode>

            <SidebarNode
               className="dndnode output"
               onDragStart={onDragStart('custom')}
               draggable
            >
               <span>output Node</span>
            </SidebarNode>

            {/* <div
               className="dndnode output"
               onDragStart={onDragStart('default')}
               draggable
            >
               default
            </div> */}
         </div>
      </aside>
   );
}

export default Sidebar;
