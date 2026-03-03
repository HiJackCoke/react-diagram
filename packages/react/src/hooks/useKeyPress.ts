import { useState, useEffect } from 'react';

interface KeyOptions {
   target?: Window | Document | HTMLElement | null;
}

export type KeyCode = string | Array<string> | null;

const defaultTarget = typeof document !== 'undefined' ? document : null;

function useKeyPress(key: KeyCode, options: KeyOptions = {}) {
   const target = options.target !== undefined ? options.target : defaultTarget;

   const [isPressed, setIsPressed] = useState(false);

   useEffect(() => {
      if (!target) return;

      const downHandler = (e: KeyboardEvent) => {
         if (e.key === key) setIsPressed(true);
      };

      const upHandler = (e: KeyboardEvent) => {
         if (e.key === key) setIsPressed(false);
      };

      const resetHandler = () => setIsPressed(false);

      target.addEventListener('keydown', downHandler as EventListener);
      target.addEventListener('keyup', upHandler as EventListener);
      window.addEventListener('blur', resetHandler);
      window.addEventListener('contextmenu', resetHandler);

      return () => {
         target.removeEventListener('keydown', downHandler as EventListener);
         target.removeEventListener('keyup', upHandler as EventListener);
         window.removeEventListener('blur', resetHandler);
         window.addEventListener('contextmenu', resetHandler);
      };
   }, [key, target]);

   return isPressed;
}

export default useKeyPress;
