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
import { PieceSize } from './PuzzleGenerator';

const nodeTypes = {
   puzzle: PuzzleNode,
};

const getId = (pieceId: number) => `puzzle-node-${pieceId}`;

type Position = 'left' | 'right' | 'top' | 'bottom';

const isOppositePosition = (
   sourcePosition: Position,
   targetPosition: Position,
): boolean => {
   const opposites: Record<Position, Position> = {
      left: 'right',
      right: 'left',
      top: 'bottom',
      bottom: 'top',
   };

   return opposites[sourcePosition] === targetPosition;
};

const getTranslateValues = (transformString: string) => {
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
};

function PuzzleDiagram() {
   const edgeUpdateSuccessful = useRef(true);
   const nodeMap = useRef(new Map<string, string[]>([]));

   const pieceSizeRef = useRef<PieceSize>({
      tabSize: 0,
      totalSize: 0,
      pieceSize: 0,
   });

   const dragCtx = useDragContext();

   const [nodes, setNodes, onNodesChange] = useNodesState([]);
   const [edges, setEdges, onEdgesChange] = useEdgesState([]);

   const onConnect = useCallback((params: Connection) => {
      const { source, target, sourcePort, targetPort } = params;

      const sourcePosition = sourcePort?.split('-')[0] as Position;
      const targetPosition = targetPort?.split('-')[0] as Position;

      if (!isOppositePosition(sourcePosition, targetPosition)) return;

      setEdges((eds) => {
         const isAlreadyConnected = eds.some((edge) => {
            return (
               (edge.source === source && edge.target === target) ||
               (edge.source === target && edge.target === source)
            );
         });

         if (isAlreadyConnected) {
            console.log(
               'These are pieces that are already connected to each other.',
            );
            return eds;
         }
         return addEdge({ ...params }, eds);
      });

      if (target && source) {
         const sourceNodes = nodeMap.current.get(source) ?? [];
         const targetNodes = nodeMap.current.get(target) ?? [];

         const targets = new Set([...sourceNodes, ...targetNodes, target]);
         const sources = new Set([...sourceNodes, ...targetNodes, source]);

         nodeMap.current.set(source, Array.from(targets));
         nodeMap.current.set(target, Array.from(sources));
      }

      setNodes((nodes) => {
         const connectedNodes = target
            ? nodeMap.current
                 .get(target)
                 ?.flatMap((node) => nodeMap.current.get(node) ?? [])
            : [];

         const filteredConnectedNodes = [...new Set(connectedNodes)];

         const sourceNode = nodes.find((node) => node.id === source);

         const sourceNodeX = sourceNode?.position.x || 0;
         const sourceNodeY = sourceNode?.position.y || 0;

         const childNodes = nodes.filter(
            (node) => filteredConnectedNodes?.includes(node.id),
         );

         let offsetX = 0;
         let offsetY = 0;

         const unCaughtNodes = nodes.filter(
            (node) =>
               !childNodes.some(
                  (childNodes) =>
                     childNodes.id === node.id && childNodes.id !== source,
               ),
         );

         return nodes.map((node) => {
            if (node.id === target) {
               if (targetPosition === 'left') {
                  offsetX = sourceNodeX + pieceSizeRef.current.pieceSize;
                  offsetY = sourceNodeY;
               }

               if (targetPosition === 'right') {
                  offsetX = sourceNodeX - pieceSizeRef.current.pieceSize;
                  offsetY = sourceNodeY;
               }

               if (targetPosition === 'top') {
                  offsetX = sourceNodeX;
                  offsetY = sourceNodeY + pieceSizeRef.current.pieceSize;
               }

               if (targetPosition === 'bottom') {
                  offsetX = sourceNodeX;
                  offsetY = sourceNodeY - pieceSizeRef.current.pieceSize;
               }

               if (childNodes.some((childNodes) => childNodes.id === source)) {
                  childNodes
                     .filter((childNodes) => childNodes.id === target)
                     .forEach((childNode) => {
                        childNode.position.x = offsetX;
                        childNode.position.y = offsetY;
                     });
               } else {
                  childNodes
                     .filter((childNodes) => childNodes.id !== target)
                     .forEach((childNode) => {
                        childNode.position.x =
                           offsetX + (childNode.position.x - node.position.x);
                        childNode.position.y =
                           offsetY + (childNode.position.y - node.position.y);
                     });
                  unCaughtNodes
                     .filter((unCaughtNode) => unCaughtNode.id !== source)
                     .forEach((unCaughtNode) => {
                        unCaughtNode.position.x =
                           offsetX +
                           (unCaughtNode.position.x - node.position.x);
                        unCaughtNode.position.y =
                           offsetY +
                           (unCaughtNode.position.y - node.position.y);
                     });

                  node.position.x = offsetX;
                  node.position.y = offsetY;
               }
            }

            return node;
         });
      });
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

      pieceSizeRef.current = pieceSize;
      setNodes((nds) => nds.concat(newNode));
      event.dataTransfer.effectAllowed = 'none';
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
