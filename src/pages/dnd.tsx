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
   const translateRegex = /translate\(\s*([^\s,]+)px\s*,\s*([^\s,]+)px\s*\)/;
   const scaleRegex = /scale\(\s*([^\s,]+)\s*(?:,\s*([^\s,]+))?\s*\)/;

   const matches = transformString.match(translateRegex);
   const scaleMatches = transformString.match(scaleRegex);

   let x = 0,
      y = 0,
      scale = 1;

   if (matches) {
      x = parseFloat(matches[1]);
      y = parseFloat(matches[2]);
   }

   if (scaleMatches) {
      scale = parseFloat(scaleMatches[1]);
   }
   return { x, y, scale };
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
         x: (event.clientX - distance.x - translate.x) / translate.scale,
         y: (event.clientY - distance.y - translate.y) / translate.scale,
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
