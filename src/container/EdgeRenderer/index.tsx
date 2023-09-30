import { memo } from 'react';
import type { ReactNode } from 'react';
import { shallow } from 'zustand/shallow';
import cc from 'classcat';

import { useStore } from 'hooks/useStore';

import MarkerComponent from './MarkerComponent';

import { getEdgePositions, getPort, getNodeData } from './utils';

import { Edge } from 'components/Edges/type';
import { ReactDiagramState } from 'components/ReactDiagramProvider/type';
import { Position, ReactDiagramProps } from 'types';
import { EdgeTypesWrapped } from './type';

import './style.css';

type GraphViewEdgeProps = Pick<ReactDiagramState, 'rfId'> &
   Pick<
      ReactDiagramProps,
      | 'onEdgeClick'
      | 'onEdgeDoubleClick'
      | 'onEdgeUpdate'
      | 'onEdgeUpdateStart'
      | 'onEdgeUpdateEnd'
   >;

type RequiredProps = Required<Pick<ReactDiagramProps, 'noPanClassName'>>;

type EdgeRendererProps = GraphViewEdgeProps &
   RequiredProps & {
      edgeTypes: EdgeTypesWrapped;
      children: ReactNode;
   };

const selector = (s: ReactDiagramState) => ({
   edges: s.edges,
   width: s.width,
   height: s.height,
   nodeInternals: s.nodeInternals,
   onError: s.onError,
});

function EdgeRenderer({
   rfId,
   edgeTypes,
   children,
   noPanClassName,
   onEdgeClick,
   onEdgeDoubleClick,
   onEdgeUpdate,
   onEdgeUpdateStart,
   onEdgeUpdateEnd,
}: EdgeRendererProps) {
   const { edges, width, height, nodeInternals } = useStore(selector, shallow);

   return (
      <>
         <svg
            width={width || '100vw'}
            height={height || '100vh'}
            className="react-diagram__edges react-diagram__container"
         >
            <MarkerComponent defaultColor="#000000" rfId={rfId} />
            <g>
               {edges.map((edge: Edge) => {
                  const {
                     data,
                     type,
                     // elProps
                     id,
                     className,
                     style,
                     ariaLabel,

                     // sourceAndTargetIds
                     source,
                     sourcePort,
                     target,
                     targetPort,

                     // marker
                     markerEnd,
                     markerStart,

                     // labelProps
                     label,
                     labelStyle,
                     labelShowBg,
                     labelBgStyle,
                     labelBgPadding,
                     labelBgBorderRadius,
                  } = edge;

                  const [sourceNodeRect, sourcePortBounds, sourceIsValid] =
                     getNodeData(nodeInternals.get(source));
                  const [targetNodeRect, targetPortBounds, targetIsValid] =
                     getNodeData(nodeInternals.get(target));

                  if (!sourceIsValid || !targetIsValid) {
                     return null;
                  }

                  let edgeType = type || 'step';

                  const EdgeComponent =
                     edgeTypes[edgeType] || edgeTypes.default;
                  const targetNodePorts = targetPortBounds!.target;
                  const sourcePortInfo = getPort(
                     sourcePortBounds!.source!,
                     sourcePort,
                  );
                  const targetPortInfo = getPort(targetNodePorts!, targetPort);
                  const sourcePosition =
                     sourcePortInfo?.position || Position.Bottom;
                  const targetPosition =
                     targetPortInfo?.position || Position.Top;
                  const isFocusable = !!edge.focusable;

                  if (!sourcePortInfo || !targetPortInfo) {
                     return null;
                  }

                  const elProps = {
                     key: id,
                     id,
                     className: cc([className, noPanClassName]),
                     style,
                     ariaLabel,
                  };

                  const sourceAndTargetIds = {
                     source,
                     sourcePort,
                     target,
                     targetPort,
                  };

                  const marker = {
                     markerEnd,
                     markerStart,
                  };

                  const labelProps = {
                     label,
                     labelStyle,
                     labelShowBg,
                     labelBgStyle,
                     labelBgPadding,
                     labelBgBorderRadius,
                  };

                  const edgePositions = getEdgePositions(
                     sourceNodeRect,
                     sourcePortInfo,
                     sourcePosition,
                     targetNodeRect,
                     targetPortInfo,
                     targetPosition,
                  );

                  const position = {
                     ...edgePositions,
                     sourcePosition,
                     targetPosition,
                  };

                  const events = {
                     onClick: onEdgeClick,
                     onEdgeDoubleClick,
                     onEdgeUpdate,
                     onEdgeUpdateStart,
                     onEdgeUpdateEnd,
                  };

                  return (
                     <EdgeComponent
                        {...elProps}
                        {...sourceAndTargetIds}
                        {...marker}
                        {...labelProps}
                        {...position}
                        {...events}
                        rfId={rfId}
                        type={edgeType}
                        data={data}
                        isFocusable={isFocusable}
                     />
                  );
               })}
            </g>
         </svg>
         {children}
      </>
   );
}

EdgeRenderer.displayName = 'EdgeRenderer';

export default memo(EdgeRenderer);
