import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';

import { internalsSymbol } from '../../utils';

import { Edge, Position } from '../../types';
import { ReactDiagramStore } from '../../components/ReactDiagramProvider/type';

import { PortType } from '../../components/Port/type';
import { EdgeWrapperComponent } from '../../components/Edges/EdgeWrapper/type';
import { ConnectionLineComponent } from './type';

type ConnectionPathProps = {
   nodeId: string;
   portType: PortType;
   edge: Edge;
   Component?: ConnectionLineComponent;
   EdgeWrapper: EdgeWrapperComponent;
};

const oppositePosition = {
   [Position.Left]: Position.Right,
   [Position.Right]: Position.Left,
   [Position.Top]: Position.Bottom,
   [Position.Bottom]: Position.Top,
};

function ConnectionPath({
   nodeId,
   portType,
   edge,
   Component,
   EdgeWrapper,
}: ConnectionPathProps) {
   const { fromNode, toX, toY } = useStore(
      useCallback(
         (s: ReactDiagramStore) => ({
            fromNode: s.nodeInternals.get(nodeId),

            toX: (s.connectionPosition.x - s.transform[0]) / s.transform[2],
            toY: (s.connectionPosition.y - s.transform[1]) / s.transform[2],
         }),
         [nodeId],
      ),
      shallow,
   );
   const fromPortBounds = fromNode?.[internalsSymbol]?.portBounds;

   const portBounds = fromPortBounds?.[portType];

   if (!fromNode || !portBounds) {
      return null;
   }

   const fromPort = portBounds[0];
   const fromPortX = fromPort
      ? fromPort.x + fromPort.width / 2
      : (fromNode.width ?? 0) / 2;
   const fromPortY = fromPort
      ? fromPort.y + fromPort.height / 2
      : fromNode.height ?? 0;
   const fromX = (fromNode.positionAbsolute?.x ?? 0) + fromPortX;
   const fromY = (fromNode.positionAbsolute?.y ?? 0) + fromPortY;
   const fromPosition = fromPort?.position;
   const toPosition = fromPosition ? oppositePosition[fromPosition] : null;

   if (!fromPosition || !toPosition) {
      return null;
   }

   if (Component) {
      return (
         <Component
            fromNode={fromNode}
            fromPort={fromPort}
            fromX={fromX}
            fromY={fromY}
            toX={toX}
            toY={toY}
            fromPosition={fromPosition}
            toPosition={toPosition}
         />
      );
   }

   return (
      <EdgeWrapper
         id={edge.id}
         className="react-diagram__connection"
         type={edge.type || 'default'}
         source={edge.source}
         target={edge.target}
         isFocusable={false}
         sourceX={fromX}
         sourceY={fromY}
         targetX={toX}
         targetY={toY}
         sourcePosition={fromPosition}
         targetPosition={toPosition}
      />
   );
}

ConnectionPath.displayName = 'ConnectionPath';

export default ConnectionPath;
