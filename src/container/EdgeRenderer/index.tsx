import { memo } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from 'hooks/useStore';

import MarkerComponent from './MarkerComponent';

import { getEdgePositions, getHandle, getNodeData } from './utils';

import { Edge } from 'components/Edges/type';
import { ReactDiagramState } from 'components/ReactDiagramProvider/type';
import { Position } from 'types';
import { EdgeTypesWrapped } from './type';

import './style.css';

type GraphViewEdgeProps = Pick<ReactDiagramState, 'rfId'>;

type EdgeRendererProps = GraphViewEdgeProps & {
   edgeTypes: EdgeTypesWrapped;
};

const selector = (s: ReactDiagramState) => ({
   edges: s.edges,
   width: s.width,
   height: s.height,
   nodeInternals: s.nodeInternals,
   onError: s.onError,
});

function EdgeRenderer({ rfId, edgeTypes }: EdgeRendererProps) {
   const { edges, width, height, nodeInternals } = useStore(selector, shallow);

   return (
      <svg
         width={width || '100vw'}
         height={height || '100vh'}
         className="react-diagram__edges react-diagram__container"
      >
         <MarkerComponent defaultColor="#000000" rfId={rfId} />
         <g>
            {edges.map((edge: Edge) => {
               const [sourceNodeRect, sourceHandleBounds, sourceIsValid] =
                  getNodeData(nodeInternals.get(edge.source));
               const [targetNodeRect, targetHandleBounds, targetIsValid] =
                  getNodeData(nodeInternals.get(edge.target));

               if (!sourceIsValid || !targetIsValid) {
                  return null;
               }

               let edgeType = edge.type || 'step';

               const EdgeComponent = edgeTypes[edgeType] || edgeTypes.default;
               const targetNodeHandles = targetHandleBounds!.target;
               const sourceHandle = getHandle(
                  sourceHandleBounds!.source!,
                  edge.sourceHandle,
               );
               const targetHandle = getHandle(
                  targetNodeHandles!,
                  edge.targetHandle,
               );
               const sourcePosition = sourceHandle?.position || Position.Bottom;
               const targetPosition = targetHandle?.position || Position.Top;
               const isFocusable = !!edge.focusable;

               if (!sourceHandle || !targetHandle) {
                  return null;
               }

               const { sourceX, sourceY, targetX, targetY } = getEdgePositions(
                  sourceNodeRect,
                  sourceHandle,
                  sourcePosition,
                  targetNodeRect,
                  targetHandle,
                  targetPosition,
               );

               return (
                  <EdgeComponent
                     key={edge.id}
                     id={edge.id}
                     className={edge.className}
                     type={edgeType}
                     data={edge.data}
                     style={edge.style}
                     label={edge.label}
                     labelStyle={edge.labelStyle}
                     labelShowBg={edge.labelShowBg}
                     labelBgStyle={edge.labelBgStyle}
                     labelBgPadding={edge.labelBgPadding}
                     labelBgBorderRadius={edge.labelBgBorderRadius}
                     source={edge.source}
                     target={edge.target}
                     sourceHandle={edge.sourceHandle}
                     targetHandle={edge.targetHandle}
                     markerEnd={edge.markerEnd}
                     markerStart={edge.markerStart}
                     sourceX={sourceX}
                     sourceY={sourceY}
                     targetX={targetX}
                     targetY={targetY}
                     sourcePosition={sourcePosition}
                     targetPosition={targetPosition}
                     rfId={rfId}
                     ariaLabel={edge.ariaLabel}
                     isFocusable={isFocusable}
                  />
               );
            })}
         </g>
      </svg>
   );
}

EdgeRenderer.displayName = 'EdgeRenderer';

export default memo(EdgeRenderer);
