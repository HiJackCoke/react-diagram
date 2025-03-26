import { useRef, useState, type DragEvent } from 'react';
import styles from './style.module.css';

import PuzzleGenerator, {
   OnImageUpdate,
   PieceSize,
   PuzzlePiece,
} from 'components/PuzzleGenerator';

import PuzzleNodeView from 'components/Node/PuzzleNode/View';
import { useDragContext } from 'contexts/DragContext';

function PuzzleSidebar() {
   const ref = useRef<HTMLElement>(null);
   const dragCtx = useDragContext();

   const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
   const [sizes, setSizes] = useState<PieceSize>({
      totalSize: 0,
      pieceSize: 0,
      tabSize: 0,
   });

   const onDragStart =
      (nodeType: string, piece: PuzzlePiece) =>
      (event: DragEvent<HTMLDivElement>) => {
         if (!dragCtx) return;
         const { draggedElementRef } = dragCtx;

         const node = event.target as HTMLDivElement;

         draggedElementRef.current = node;

         const x = event.clientX - node.offsetLeft;
         const y =
            event.clientY - node.offsetTop + (ref.current?.scrollTop || 0);
         const distance = {
            x,
            y,
         };

         event.dataTransfer.setData(
            'application/react-cosmos-diagram',
            nodeType,
         );
         event.dataTransfer.setData(
            'application/node',
            JSON.stringify(distance),
         );

         event.dataTransfer.setData('application/piece', JSON.stringify(piece));

         event.dataTransfer.setData(
            'application/pieceSize',
            JSON.stringify(sizes),
         );

         event.dataTransfer.effectAllowed = 'move';
      };

   const handlePuzzleUpdate: OnImageUpdate = (pieces, size) => {
      setPieces(pieces);
      setSizes(size);
   };

   return (
      <aside ref={ref} className={styles.container}>
         <PuzzleGenerator onImageUpdate={handlePuzzleUpdate} />

         <div className={styles['puzzle-wrapper']}>
            {pieces.map((piece) => (
               <PuzzleNodeView
                  key={piece.id}
                  onDragStart={onDragStart('puzzle', piece)}
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
