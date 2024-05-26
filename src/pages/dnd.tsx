import { DragEvent, useCallback } from 'react';

import ReactDiagram, { useNodesState, Background } from 'react-cosmos-diagram';

import Sidebar from 'components/Sidebar';

import 'react-cosmos-diagram/dist/style.css';

const initialNodes = [
   {
      id: '1',

      data: { label: 'Custom Node' },
      position: { x: 100, y: 100 },
   },
];

let id = 0;
const getId = () => `dndnode_${id++}`;
function getTranslateValues(transformString: string) {
   // Regular expression to match the translate function and capture x and y values
   const translateRegex = /translate\(\s*([^\s,]+)px\s*,\s*([^\s,]+)px\s*\)/;

   // Execute the regex on the transform string
   const matches = transformString.match(translateRegex);

   // If matches found, parse x and y values
   if (matches) {
      const x = parseFloat(matches[1]);
      const y = parseFloat(matches[2]);
      return { x, y };
   }
   return { x: 0, y: 0 };
}

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

      const container = event.target as HTMLDivElement;
      const viewport = container.querySelector(
         '.react-diagram__viewport',
      ) as HTMLDivElement;

      const translate = getTranslateValues(viewport?.style.transform);

      const position = {
         x: event.clientX - distance.x - translate.x,
         y: event.clientY - distance.y - translate.y,
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
