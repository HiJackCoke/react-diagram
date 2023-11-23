import { ComponentType } from 'react';
import { Node, Position } from '../../types';

import { PortElement } from '../Port/type';

export type ConnectionEdgeComponentProps = {
   fromNode?: Node;
   fromPort?: PortElement;
   fromX: number;
   fromY: number;
   toX: number;
   toY: number;
   fromPosition: Position;
   toPosition: Position;
};

export type ConnectionEdgeComponent =
   ComponentType<ConnectionEdgeComponentProps>;
