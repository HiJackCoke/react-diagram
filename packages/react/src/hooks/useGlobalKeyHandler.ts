import { useEffect, useState } from 'react';
import { useStoreApi } from './useStore';

export type KeyCode = string | Array<string> | null;

const useGlobalKeyHandler = (multiSelectionKeyCode: KeyCode = 'Meta') => {
   const store = useStoreApi();

   const [multiSelectionActivate, setMultiSelectionActivate] = useState(false);

   const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === multiSelectionKeyCode) {
         setMultiSelectionActivate(true);
      }
   };

   const handleKeyUp = () => {
      setMultiSelectionActivate(false);
   };

   useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      return () => {
         document.removeEventListener('keydown', handleKeyDown);
         document.removeEventListener('keyup', handleKeyUp);
      };
   }, []);

   useEffect(() => {
      store.setState({
         multiSelectionActive: multiSelectionActivate,
      });
   }, [multiSelectionActivate]);
};

export default useGlobalKeyHandler;
