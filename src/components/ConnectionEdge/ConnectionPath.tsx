import { CSSProperties, useCallback } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from 'hooks/useStore';

import { internalsSymbol } from 'utils';
import { ReactDiagramStore, Position } from 'types';

type ConnectionPathProps = {
   nodeId: string;

   style?: CSSProperties;
};

const oppositePosition = {
   [Position.Left]: Position.Right,
   [Position.Right]: Position.Left,
   [Position.Top]: Position.Bottom,
   [Position.Bottom]: Position.Top,
};

function ConnectionPath({
   nodeId,

   style,
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
   const portType = 'source';

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

   const dAttr = `M${fromX},${fromY} ${toX},${toY}`;

   return (
      <path
         d={dAttr}
         fill="none"
         className="react-diagram__connection-path"
         style={style}
      />
   );
}

ConnectionPath.displayName = 'ConnectionPath';

export default ConnectionPath;
