import { DragEvent, useCallback } from 'react';

import ReactDiagram, { useNodesState, Background } from 'react-cosmos-diagram';

import 'react-cosmos-diagram/dist/style.css';

import Sidebar from 'components/Sidebar';

const initialNodes = [
   {
      id: '1',

      data: { label: 'Custom Node' },
      position: { x: 100, y: 100 },
   },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

function Index() {
   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

   const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
   }, []);

   const onDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
         'application/react-cosmos-diagram',
      );

      const distance = JSON.parse(
         event.dataTransfer.getData('application/node'),
      );

      if (typeof type === 'undefined' || !type) {
         return;
      }

      const position = {
         x: event.clientX - distance.x,
         y: event.clientY - distance.y,
      };

      const newNode = {
         id: getId(),
         type,
         position,
         data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
   }, []);

   return (
      <div className="dnd-container">
         <div className="reactdiagram-wrapper">
            <ReactDiagram
               nodes={nodes}
               connectionRadius={30}
               minZoom={1}
               maxZoom={2}
               onNodesChange={onNodesChange}
               onDrop={onDrop}
               onDragOver={onDragOver}
            >
               <Background />
            </ReactDiagram>
         </div>

         <Sidebar />
      </div>
   );
}

export default Index;
