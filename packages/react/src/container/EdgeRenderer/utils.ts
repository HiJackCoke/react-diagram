import type { ComponentType } from 'react';

import { PortElement, NodePortBounds } from '@diagram/core';

import StraightEdge from '../../components/Edges/StraightEdge';
import StepEdge from '../../components/Edges/StepEdge';
import BezierEdge from '../../components/Edges/BezierEdge';

import wrapEdge from '../../components/Edges/EdgeWrapper';
import { internalsSymbol, rectToBox } from '../../utils';

import { Rect, Transform, Position, XYPosition } from '@diagram/core';

import { Node } from '../../components/Node/type';
import { EdgeProps } from '../../components/Edges/type';
import { EdgeTypes, EdgeTypesWrapped } from './type';

export const createEdgeTypes = (edgeTypes: EdgeTypes): EdgeTypesWrapped => {
   const defaultTypes: EdgeTypesWrapped = {
      default: wrapEdge(
         (edgeTypes.straight || StraightEdge) as ComponentType<EdgeProps>,
      ),
      step: wrapEdge((edgeTypes.step || StepEdge) as ComponentType<EdgeProps>),
      bezier: wrapEdge(
         (edgeTypes.bezier || BezierEdge) as ComponentType<EdgeProps>,
      ),
   };

   const wrappedTypes = {} as EdgeTypesWrapped;
   const customTypes: EdgeTypesWrapped = Object.keys(edgeTypes)
      .filter((k) => !Object.keys(defaultTypes).includes(k))
      .reduce((res, key) => {
         res[key] = wrapEdge(
            (edgeTypes[key] || StepEdge) as ComponentType<EdgeProps>,
         );

         return res;
      }, wrappedTypes);

   return {
      ...defaultTypes,
      ...customTypes,
   };
};

export function getPortPosition(
   position: Position,
   nodeRect: Rect,
   port: PortElement | null = null,
): XYPosition {
   const x = (port?.x || 0) + nodeRect.x;
   const y = (port?.y || 0) + nodeRect.y;
   const width = port?.width || nodeRect.width;
   const height = port?.height || nodeRect.height;

   switch (position) {
      case Position.Top:
         return {
            x: x + width / 2,
            y,
         };
      case Position.Right:
         return {
            x: x + width,
            y: y + height / 2,
         };
      case Position.Bottom:
         return {
            x: x + width / 2,
            y: y + height,
         };
      case Position.Left:
         return {
            x,
            y: y + height / 2,
         };
   }
}

export function getPort(
   bounds: PortElement[],
   portId?: string | null,
): PortElement | null {
   if (!bounds) {
      return null;
   }

   if (bounds.length === 1 || !portId) {
      return bounds[0];
   } else if (portId) {
      return bounds.find((d) => d.id === portId) || null;
   }

   return null;
}

interface EdgePositions {
   sourceX: number;
   sourceY: number;
   targetX: number;
   targetY: number;
}

export const getEdgePositions = (
   sourceNodeRect: Rect,
   sourcePort: PortElement,
   sourcePosition: Position,
   targetNodeRect: Rect,
   targetPort: PortElement,
   targetPosition: Position,
): EdgePositions => {
   const sourcePortPos = getPortPosition(
      sourcePosition,
      sourceNodeRect,
      sourcePort,
   );
   const targetPortPos = getPortPosition(
      targetPosition,
      targetNodeRect,
      targetPort,
   );

   return {
      sourceX: sourcePortPos.x,
      sourceY: sourcePortPos.y,
      targetX: targetPortPos.x,
      targetY: targetPortPos.y,
   };
};

interface IsEdgeVisibleParams {
   sourcePos: XYPosition;
   targetPos: XYPosition;
   sourceWidth: number;
   sourceHeight: number;
   targetWidth: number;
   targetHeight: number;
   width: number;
   height: number;
   transform: Transform;
}

export function isEdgeVisible({
   sourcePos,
   targetPos,
   sourceWidth,
   sourceHeight,
   targetWidth,
   targetHeight,
   width,
   height,
   transform,
}: IsEdgeVisibleParams): boolean {
   const edgeBox = {
      x: Math.min(sourcePos.x, targetPos.x),
      y: Math.min(sourcePos.y, targetPos.y),
      x2: Math.max(sourcePos.x + sourceWidth, targetPos.x + targetWidth),
      y2: Math.max(sourcePos.y + sourceHeight, targetPos.y + targetHeight),
   };

   if (edgeBox.x === edgeBox.x2) {
      edgeBox.x2 += 1;
   }

   if (edgeBox.y === edgeBox.y2) {
      edgeBox.y2 += 1;
   }

   const viewBox = rectToBox({
      x: (0 - transform[0]) / transform[2],
      y: (0 - transform[1]) / transform[2],
      width: width / transform[2],
      height: height / transform[2],
   });

   const xOverlap = Math.max(
      0,
      Math.min(viewBox.x2, edgeBox.x2) - Math.max(viewBox.x, edgeBox.x),
   );
   const yOverlap = Math.max(
      0,
      Math.min(viewBox.y2, edgeBox.y2) - Math.max(viewBox.y, edgeBox.y),
   );
   const overlappingArea = Math.ceil(xOverlap * yOverlap);

   return overlappingArea > 0;
}

export function getNodeData(
   node?: Node,
): [Rect, NodePortBounds | null, boolean] {
   const portBounds = node?.[internalsSymbol]?.portBounds || null;

   const isValid =
      portBounds &&
      node?.width &&
      node?.height &&
      typeof node?.positionAbsolute?.x !== 'undefined' &&
      typeof node?.positionAbsolute?.y !== 'undefined';

   return [
      {
         x: node?.positionAbsolute?.x || 0,
         y: node?.positionAbsolute?.y || 0,
         width: node?.width || 0,
         height: node?.height || 0,
      },
      portBounds,
      !!isValid,
   ];
}
