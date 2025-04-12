import { ComponentType } from 'react';
import { PortElement, Position } from 'cosmos-diagram';
import { Node } from '../../types';

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
