import { NodeProps, Port, Position } from 'react-cosmos-diagram';

import styles from './style.module.css';
import { PieceSize, PuzzleEdge, PuzzlePiece } from 'components/PuzzleGenerator';
import { CSSProperties } from 'react';

type Props = {
   piece: PuzzlePiece;
   size: PieceSize;
};

export const capitalizeFirstLetter = (
   str: Lowercase<keyof typeof Position>,
): keyof typeof Position => {
   return (str[0].toUpperCase() + str.slice(1)) as keyof typeof Position;
};

function PuzzleNode({ data }: NodeProps<Props>) {
   const { piece } = data;

   const { id, dataUrl, edge } = piece;

   const edgeMap = Object.entries(edge) as [
      keyof PuzzlePiece['edge'],
      PuzzleEdge,
   ][];

   return (
      <div className={styles.container} onDrag={(e) => e.preventDefault()}>
         <div className={styles.wrapper}>
            <img src={dataUrl} alt={`piece-${id}`} />
         </div>

         {edgeMap.map(([key, value]) => {
            console.log;
            if (value === 'flat') return null;
            return (
               <div
                  key={`${key}-${value}`}
                  className={`${styles[`${value}-${key}`]}`}
                  style={
                     {
                        '--position': `${
                           data.size.tabSize + data.size.tabSize / 2
                        }px`,
                     } as CSSProperties
                  }
               >
                  <Port
                     id={`${key}-${value}`}
                     position={Position[capitalizeFirstLetter(key)]}
                     type={value === 'tab' ? 'target' : 'source'}
                  />
               </div>
            );
         })}
      </div>
   );
}

export default PuzzleNode;
