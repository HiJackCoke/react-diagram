import type { ReactNode } from 'react';

import './style.css';

type ViewportProps = {
   children: ReactNode;
};

function Viewport({ children }: ViewportProps) {
   return (
      <div className="react-diagram__viewport react-diagram__container">
         {children}
      </div>
   );
}

export default Viewport;
