import type { ReactNode } from 'react';

import { useStore } from '../../hooks/useStore';

import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';

import './style.css';

const selector = (s: ReactDiagramState) =>
   `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`;

type ViewportProps = {
   children: ReactNode;
};

function Viewport({ children }: ViewportProps) {
   const transform = useStore(selector);

   return (
      <div
         className="react-diagram__viewport react-diagram__container"
         style={{ transform }}
      >
         {children}
      </div>
   );
}

export default Viewport;
