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

      // 포커스를 잃었을 때 상태를 초기화 (키를 떼지 않은 채 탭을 이동하는 경우 대비)
      const resetHandler = () => setIsPressed(false);

      target.addEventListener('keydown', downHandler as EventListener);
      target.addEventListener('keyup', upHandler as EventListener);
      window.addEventListener('blur', resetHandler); // 윈도우 포커스 해제 대응
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
