import { DragEvent, useCallback, useRef } from 'react';

import ReactDiagram, {
   addEdge,
   Connection,
   Edge,
   updateEdge,
   useEdgesState,
   useNodesState,
} from 'react-cosmos-diagram';

import PuzzleSidebar from 'components/PuzzleSidebar';
import PuzzleNode from 'components/Node/PuzzleNode';
import { useDragContext } from 'contexts/DragContext';

const nodeTypes = {
   puzzle: PuzzleNode,
};

const getId = (pieceId: number) => `puzzle-node-${pieceId}`;
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

function PuzzleDiagram() {
   const edgeUpdateSuccessful = useRef(true);

   const dragCtx = useDragContext();

   const [nodes, setNodes, onNodesChange] = useNodesState([]);
   const [edges, setEdges, onEdgesChange] = useEdgesState([]);

   const onConnect = useCallback((params: Connection) => {
      setEdges((eds) => addEdge({ ...params }, eds));
   }, []);

   const onEdgeUpdateStart = useCallback(() => {
      edgeUpdateSuccessful.current = false;
   }, []);

   const onEdgeUpdate = useCallback(
      (originEdge: Edge, newConnection: Connection) => {
         edgeUpdateSuccessful.current = true;

         setEdges((els) => updateEdge(originEdge, newConnection, els));
      },
      [],
   );

   const onEdgeUpdateEnd = useCallback((_c: any, edge: Edge) => {
      if (!edgeUpdateSuccessful.current) {
         setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeUpdateSuccessful.current = true;
   }, []);

   const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!dragCtx) return;

      event.dataTransfer.dropEffect = 'move';
   }, []);

   const onDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!dragCtx) return;
      const { draggedElementRef } = dragCtx;

      const node = draggedElementRef.current;
      if (!node) return;
      //   node.remove();
      node.style.visibility = 'hidden';

      const type = event.dataTransfer.getData(
         'application/react-cosmos-diagram',
      );

      const distance = JSON.parse(
         event.dataTransfer.getData('application/node'),
      );

      const piece = JSON.parse(event.dataTransfer.getData('application/piece'));

      const pieceSize = JSON.parse(
         event.dataTransfer.getData('application/pieceSize'),
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
         id: getId(piece.id),
         type,
         position,
         data: {
            piece,
            size: pieceSize,
         },
      };

      setNodes((nds) => nds.concat(newNode));
   }, []);

   return (
      <div className="dnd-container">
         <div className="reactdiagram-wrapper">
            <ReactDiagram
               nodes={nodes}
               edges={edges}
               nodeTypes={nodeTypes}
               connectionRadius={30}
               minZoom={1}
               maxZoom={2}
               onNodesChange={onNodesChange}
               onDrop={onDrop}
               onDragOver={onDragOver}
               onEdgeUpdate={onEdgeUpdate}
               onEdgeUpdateStart={onEdgeUpdateStart}
               onEdgeUpdateEnd={onEdgeUpdateEnd}
               onEdgesChange={onEdgesChange}
               onConnect={onConnect}
            ></ReactDiagram>
         </div>

         <PuzzleSidebar />
      </div>
   );
}

export default PuzzleDiagram;
