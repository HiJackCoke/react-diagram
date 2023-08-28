import { PortProps } from './type';

import './style.css';

function Port({ type, position }: PortProps) {
   return (
      <div
         data-port-position={position}
         className={`react-diagram__port react-diagram__port-${position} ${type}`}
      />
   );
}

export default Port;
