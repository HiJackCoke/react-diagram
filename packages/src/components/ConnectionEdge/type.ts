import { ComponentType, CSSProperties } from 'react';
import { Node, Position } from '../../types';

import { PortElement } from '../Port/type';

export enum ConnectionEdgeType {
   Straight = 'straight',
   Bezier = 'bezier',
   Step = 'step',
}

export type ConnectionEdgeComponentProps = {
   connectionEdgeType: ConnectionEdgeType;
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
