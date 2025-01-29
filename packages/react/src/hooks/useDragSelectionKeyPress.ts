import { useEffect, useState } from 'react';
import { KeyCode } from './useGlobalKeyHandler';

const useDragSelectionKeyPress = (dragSelectionKeyCode?: KeyCode) => {
   const [dragSelectionKeyPressed, setDragSelectionKeyPressed] =
      useState(false);

   // useKeyPress

   const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === dragSelectionKeyCode) {
         setDragSelectionKeyPressed(true);
      }
   };

   const handleKeyUp = () => {
      setDragSelectionKeyPressed(false);
   };

   useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      return () => {
         document.removeEventListener('keydown', handleKeyDown);
         document.removeEventListener('keyup', handleKeyUp);
      };
   }, []);

   return dragSelectionKeyPressed;
};

export default useDragSelectionKeyPress;
