import {
   createContext,
   MutableRefObject,
   ReactNode,
   useContext,
   useRef,
} from 'react';

const DragContext = createContext<{
   draggedElementRef: MutableRefObject<HTMLElement | null>;
} | null>(null);

const DiagramManager = ({ children }: { children: ReactNode }) => {
   const draggedElementRef = useRef<HTMLElement | null>(null);

   return (
      <DragContext.Provider value={{ draggedElementRef }}>
         {children}
      </DragContext.Provider>
   );
};

export const useDragContext = () => {
   return useContext(DragContext);
};

export default DiagramManager;
