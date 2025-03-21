import { NodeProps, Port, Position } from 'react-cosmos-diagram';
import { ReactNode } from 'react';
import styles from './style.module.css';

function PuzzleNode({ data }: NodeProps<{ element: ReactNode }>) {
   return (
      <div className={styles.container}>
         <Port position={Position.Left} type="target" />
         <div className={styles.wrapper}>{data.element}</div>
         <Port position={Position.Right} type="source" />
      </div>
   );
}

export default PuzzleNode;
