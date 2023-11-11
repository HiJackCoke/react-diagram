import { CSSProperties } from 'react';

import { internalsSymbol } from '../../utils';

import { Position, XYPosition, CoordinateExtent } from '../../types';
import { PortBounds } from '../Port/utils';
import { WrapNodeProps } from './wrapNode';

export type Node<T = any, U extends string | undefined = string | undefined> = {
   id: string;
   position: XYPosition;
   data: T;
   type?: U;
   style?: CSSProperties;
   className?: string;
   sourcePosition?: Position;
   targetPosition?: Position;
   hidden?: boolean;
   selected?: boolean;
   dragging?: boolean;
   draggable?: boolean;
   selectable?: boolean;
   connectable?: boolean;
   deletable?: boolean;
   dragHandle?: string;
   width?: number;
   height?: number;
   parentNode?: string;
   zIndex?: number;
   extent?: 'parent' | CoordinateExtent;
   expandParent?: boolean;
   positionAbsolute?: XYPosition;
   ariaLabel?: string;
   focusable?: boolean;
   resizing?: boolean;

   [internalsSymbol]?: {
      z?: number;
      portBounds?: PortBounds;
      isParent?: boolean;
   };
};

export type NodeProps<T = any> = Pick<
   WrapNodeProps<T>,
   | 'id'
   | 'data'
   | 'dragHandle'
   | 'type'
   | 'selected'
   | 'positionX'
   | 'positionY'
   | 'zIndex'
   | 'width'
   | 'height'
> & {
   targetPosition?: Position;
   sourcePosition?: Position;
};
