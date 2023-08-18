import './style.css';

function Port({
   type,
   position,
}: {
   type: 'target' | 'source';
   position: 'top' | 'bottom';
}) {
   return (
      <div
         data-port-position={position}
         className={`react-diagram__port react-diagram__port-${position} ${type}`}
      />
   );
}

export default Port;
