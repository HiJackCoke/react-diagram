import { HTMLAttributes } from 'react';
import './style.css';

const SidebarNode = ({
   children,
   draggable,
   onDragStart,
}: HTMLAttributes<HTMLDivElement>) => {
   return (
      <div
         className="custom-node__container"
         draggable={draggable}
         onDragStart={onDragStart}
      >
         <div className="custom-node__wrapper">{children}</div>
      </div>
   );
};

export default SidebarNode;
