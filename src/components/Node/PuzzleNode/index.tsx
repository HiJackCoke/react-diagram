import { NodeProps, Port, Position } from 'react-cosmos-diagram';

import styles from './style.module.css';
import { PieceSize, PuzzleEdge, PuzzlePiece } from 'components/PuzzleGenerator';

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
                     <div className={`${styles[`blank-${key}`]}`}>
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
                     <div className={`${styles[`tab-${key}`]}`}>
                        <Port
                           key={key}
                           id={key}
                           position={Position[capitalizeFirstLetter(key)]}
                           type="source"
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
