import { useState } from 'react';
import ReactDiagram, { useNodesState, Background } from 'react-cosmos-diagram';

import 'react-cosmos-diagram/dist/style.css';

const initialNodes = [
   {
      id: '1',

      data: { label: 'Node1' },
      position: { x: 0, y: 0 },
   },
   {
      id: '2',
      width: 130,
      height: 130,
      data: { label: 'Node2' },
      position: { x: 0, y: 150 },
   },
   {
      id: '3',
      width: 100,
      height: 100,
      data: { label: 'Node3' },
      position: { x: 150, y: 0 },
   },
   {
      id: '4',
      width: 100,
      height: 100,
      data: { label: 'Node4' },
      position: { x: 150, y: 150 },
   },
   {
      id: '5',
      width: 100,
      height: 100,
      data: { label: 'Node5' },
      position: { x: 150, y: 300 },
   },
];

function Grid() {
   const [centerStep, setCenterStep] = useState(false);
   const [smoothStep, setSmoothStep] = useState(false);

   const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);

   return (
      <>
         <button
            style={{ position: 'fixed', zIndex: '9999', right: 130 }}
            onClick={() => setCenterStep(!centerStep)}
         >
            Center Step {centerStep ? 'off' : 'on'}
         </button>

         <button
            style={{ position: 'fixed', zIndex: '9999', right: 0 }}
            onClick={() => setSmoothStep(!smoothStep)}
         >
            Smooth Step {smoothStep ? 'off' : 'on'}
         </button>
         <ReactDiagram
            nodes={nodes}
            onNodesChange={onNodesChange}
            centerStep={centerStep}
            smoothStep={smoothStep}
            gridStep={[150, 150]}
         >
            <Background />
         </ReactDiagram>
      </>
   );
}

export default Grid;
