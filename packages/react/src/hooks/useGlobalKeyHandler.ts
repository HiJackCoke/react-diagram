import { useEffect } from 'react';
import { useStoreApi } from './useStore';
import useKeyPress, { KeyCode } from './useKeyPress';

const win = typeof window !== 'undefined' ? window : undefined;

export type UseGlobalKeyHandlerParams = {
   deleteKeyCode?: KeyCode | null;
   multiSelectionKeyCode?: KeyCode | null;
};

const useGlobalKeyHandler = ({
   deleteKeyCode = 'Backspace',
   multiSelectionKeyCode = 'Meta',
}: UseGlobalKeyHandlerParams) => {
   const store = useStoreApi();

   const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode, {
      target: win,
   });
   const deleteKeyPressed = useKeyPress(deleteKeyCode);

   useEffect(() => {
      if (deleteKeyPressed) {
         const { edges, getNodes, deleteElements, resetSelectedElements } =
            store.getState();
         const nodes = getNodes();
         resetSelectedElements();
         deleteElements({
            nodes: nodes.filter((n) => n.selected),
            edges: edges.filter((e) => e.selected),
         });
      }
   }, [deleteKeyPressed]);

   useEffect(() => {
      store.setState({
         multiSelectionActive: multiSelectionKeyPressed,
      });
   }, [multiSelectionKeyPressed]);
};

export default useGlobalKeyHandler;
