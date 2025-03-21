import DiagramManager from 'contexts/DragContext';
import PuzzleDiagram from 'components/PuzzleDiagram';

function Puzzle() {
   return (
      <DiagramManager>
         <PuzzleDiagram />
      </DiagramManager>
   );
}

export default Puzzle;
