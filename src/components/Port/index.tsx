import './style.css';

function Port({ position }: { position: string }) {
   return (
      <div className={`react-diagram__port react-diagram__port-${position}`} />
   );
}

export default Port;
