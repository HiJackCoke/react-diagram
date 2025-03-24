import { NodeProps, Port, Position } from 'react-cosmos-diagram';

import styles from './style.module.css';
import { PieceSize, PuzzleEdge, PuzzlePiece } from 'components/PuzzleGenerator';
import { CSSProperties } from 'react';

type Props = {
   piece: PuzzlePiece;
   size: PieceSize;
};

const capitalizeFirstLetter = (
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
      <div className={styles.container}>
         <div className={styles.wrapper}>
            <img src={dataUrl} alt={`piece-${id}`} />
         </div>

         {edgeMap.map(([key, value]) => {
            switch (value) {
               case 'flat':
                  return null;
               case 'blank':
                  return (
                     <div
                        key={`${key}-${value}`}
                        className={`${styles[`blank-${key}`]}`}
                        style={{
                           '--position': `${
                           data.size.tabSize + data.size.tabSize / 2
                        }px`
                        } as CSSProperties}
                     >
                        <Port
                           key={key}
                           id={key}
                           position={Position[capitalizeFirstLetter(key)]}
                           type="target"
                      
                        />
                     </div>
                  );
               case 'tab':
                  return (
                     <div
                        key={`${key}-${value}`}
                        className={`${styles[`tab-${key}`]}`}
                     >
                        <Port
                           key={key}
                           id={key}
                           position={Position[capitalizeFirstLetter(key)]}
                           type="source"
                           data-position={`${
                              data.size.tabSize + data.size.tabSize / 2
                           }px`}
                        />
                     </div>
                  );
               default:
                  return null;
            }
         })}
      </div>
   );
}

export default PuzzleNode;
