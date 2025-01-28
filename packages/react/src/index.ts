export {
   clamp,
   getStepPath,
   getStraightPath,
   getBezierEdgeCenter,
   getBezierPath,
   rectToBox,
   boxToRect,
} from '@diagram/core';

import ReactDiagram from './container/ReactDiagram';

export { default as ReactDiagramProvider } from './components/ReactDiagramProvider';

export { default as Port } from './components/Port';

export { default as BaseEdge } from './components/Edges/BaseEdge';
export { default as StepEdge } from './components/Edges/StepEdge';

export { default as BezierEdge } from './components/Edges/BezierEdge';

export * from './hooks/useNodesEdgesState';
// export { useStore, useStoreApi } from './hooks/useStore';
// export { default as useGetPointerPosition } from './hooks/useGetPointerPosition';
// export { useNodeId } from './contexts/NodeIdContext';

export { internalsSymbol } from './utils';
export {
   isNode,
   isEdge,
   addEdge,
   updateEdge,
   // getNodePositionWithOrigin,
} from './utils/graph';
// export { applyNodeChanges, applyEdgeChanges } from './utils/changes';

export * from './types';

// types
export type {
   XYPosition,
   XYZPosition,
   Dimensions,
   CoordinateExtent,
   Transform,
   Rect,
   Box,
   GetStepPosition,
   GetStepPathParams,
   GetBezierPathParams,
   GetControlWithCurvatureParams,
} from '@diagram/core';

export { Position, MarkerType } from '@diagram/core';

export { default as Background } from './components/Background';

export default ReactDiagram;
