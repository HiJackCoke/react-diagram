import { ComponentType } from 'react';
import { Node, Position } from '../../types';

import { PortElement } from '../../components/Port/type';

export type ConnectionLineComponentProps = {
   fromNode?: Node;
   fromPort?: PortElement;
   fromX: number;
   fromY: number;
   toX: number;
   toY: number;
   fromPosition: Position;
   toPosition: Position;
};

export type ConnectionLineComponent =
   ComponentType<ConnectionLineComponentProps>;
