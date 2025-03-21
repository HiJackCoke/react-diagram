import { useState, type DragEvent } from 'react';
import styles from './style.module.css';

import PuzzleGenerator, {
   OnImageUpdate,
   PieceSize,
   PuzzlePiece,
} from 'components/PuzzleGenerator';

import PuzzleNodeView from 'components/Node/PuzzleNode/View';
import { useDragContext } from 'contexts/DragContext';

function PuzzleSidebar() {
   const dragCtx = useDragContext();

   const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
   const [sizes, setSizes] = useState<PieceSize>({
      totalSize: 0,
      pieceSize: 0,
      tabSize: 0,
   });

   const onDragStart =
      (nodeType: string) => (event: DragEvent<HTMLDivElement>) => {
         if (!dragCtx) return;
         const { draggedElementRef } = dragCtx;

         const node = event.target as HTMLDivElement;

         draggedElementRef.current = node;

         const x = event.clientX - node.offsetLeft;
         const y = event.clientY - node.offsetTop;
         const distance = {
            x,
            y,
         };

         const element = event.target as HTMLDivElement;

         event.dataTransfer.setData(
            'application/react-cosmos-diagram',
            nodeType,
         );
         event.dataTransfer.setData(
            'application/node',
            JSON.stringify(distance),
         );

         event.dataTransfer.setData('text/plain', element.outerHTML);
         event.dataTransfer.effectAllowed = 'move';
      };

   const handlePuzzleUpdate: OnImageUpdate = (pieces, size) => {
      setPieces(pieces);
      setSizes(size);
   };

   return (
      <aside className={styles.container}>
         <PuzzleGenerator onImageUpdate={handlePuzzleUpdate} />

         <div className={styles['puzzle-wrapper']}>
            {pieces.map((piece) => (
               <PuzzleNodeView
                  key={piece.id}
                  onDragStart={onDragStart('puzzle')}
               >
                  <img
                     src={piece.dataUrl}
                     alt={`piece-${piece.id}`}
                     style={{
                        width: `${sizes.totalSize}px`,
                        height: `${sizes.totalSize}px`,
                        objectFit: 'cover',
                     }}
                  />
               </PuzzleNodeView>
            ))}
         </div>
      </aside>
   );
}

export default PuzzleSidebar;
