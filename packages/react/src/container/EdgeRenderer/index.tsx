import { memo } from 'react';
import { shallow } from 'zustand/shallow';
import cc from 'classcat';

import { useStore } from '../../hooks/useStore';

import MarkerComponent from './MarkerComponent';

import { getEdgePositions, getPort, getNodeData } from './utils';

import { Position } from 'cosmos-diagram';
import { Edge } from '../../components/Edges/type';
import { ReactDiagramState } from '../../components/ReactDiagramProvider/type';
import { ReactDiagramProps } from '../../types';
import { EdgeTypesWrapped } from './type';

type GraphViewEdgeProps = Pick<ReactDiagramState, 'rfId'> &
   Pick<
      ReactDiagramProps,
      | 'edgeUpdaterRadius'
      | 'onEdgeClick'
      | 'onEdgeDoubleClick'
      | 'onEdgeContextMenu'
      | 'onEdgeMouseEnter'
      | 'onEdgeMouseMove'
      | 'onEdgeMouseLeave'
      | 'onEdgeUpdate'
      | 'onEdgeUpdateStart'
      | 'onEdgeUpdateEnd'
   >;

type RequiredProps = Required<Pick<ReactDiagramProps, 'noPanClassName'>>;

type EdgeRendererProps = GraphViewEdgeProps &
   RequiredProps & {
      edgeTypes: EdgeTypesWrapped;
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
   noPanClassName,
   edgeUpdaterRadius,
   onEdgeClick,
   onEdgeDoubleClick,
   onEdgeContextMenu,
   onEdgeMouseEnter,
   onEdgeMouseMove,
   onEdgeMouseLeave,
   onEdgeUpdate,
   onEdgeUpdateStart,
   onEdgeUpdateEnd,
}: EdgeRendererProps) {
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

               const edgeType = type || 'straight';

               const EdgeComponent = edgeTypes[edgeType] || edgeTypes.default;
               const targetNodePorts = targetPortBounds!.target;
               const sourcePortInfo = getPort(
                  sourcePortBounds!.source!,
                  sourcePort,
               );
               const targetPortInfo = getPort(targetNodePorts!, targetPort);
               const sourcePosition =
                  sourcePortInfo?.position || Position.Bottom;
               const targetPosition = targetPortInfo?.position || Position.Top;
               const isFocusable = !!edge.focusable;

               if (!sourcePortInfo || !targetPortInfo) {
                  return null;
               }

               const elProps = {
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
                  onDoubleClick: onEdgeDoubleClick,
                  onContextMenu: onEdgeContextMenu,
                  onMouseEnter: onEdgeMouseEnter,
                  onMouseMove: onEdgeMouseMove,
                  onMouseLeave: onEdgeMouseLeave,
                  onEdgeUpdate,
                  onEdgeUpdateStart,
                  onEdgeUpdateEnd,
               };

               return (
                  <EdgeComponent
                     key={id}
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
                     edgeUpdaterRadius={edgeUpdaterRadius}
                  />
               );
            })}
         </g>
      </svg>
   );
}

EdgeRenderer.displayName = 'EdgeRenderer';

export default memo(EdgeRenderer);
