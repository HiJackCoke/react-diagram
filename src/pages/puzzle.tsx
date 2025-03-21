import { DragEvent, useCallback } from 'react';

import ReactDiagram, { useNodesState } from 'react-cosmos-diagram';

import PuzzleSidebar from 'components/PuzzleSidebar';
import 'react-cosmos-diagram/dist/style.css';
import PuzzleNode from 'components/Node/PuzzleNode';

const nodeTypes = {
   puzzle: PuzzleNode,
};

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

function Puzzle() {
   const [nodes, setNodes, onNodesChange] = useNodesState([]);

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

      const el = event.dataTransfer.getData('text/plain');

      const container = event.target as HTMLDivElement;
      const viewport = container.querySelector(
         '.react-diagram__viewport',
      ) as HTMLDivElement;

      const translate = getTranslateValues(viewport?.style.transform);

      const position = {
         x: (event.clientX - distance.x - translate.x) / translate.scale,
         y: (event.clientY - distance.y - translate.y) / translate.scale,
      };

      console.log(el);
      const newNode = {
         id: getId(),
         type,
         position,
         data: {
            element: (
               <div
                  style={{
                     width: '100%',
                     display: 'flex',
                     justifyContent: 'center',
                  }}
                  dangerouslySetInnerHTML={{ __html: el }}
               />
            ),
         },
      };

      setNodes((nds) => nds.concat(newNode));
   }, []);

   return (
      <div className="dnd-container">
         <div className="reactdiagram-wrapper">
            <ReactDiagram
               nodes={nodes}
               nodeTypes={nodeTypes}
               connectionRadius={30}
               minZoom={1}
               maxZoom={2}
               onNodesChange={onNodesChange}
               onDrop={onDrop}
               onDragOver={onDragOver}
            ></ReactDiagram>
         </div>

         <PuzzleSidebar />
      </div>
   );
}

export default Puzzle;
