import { Node } from '../types';

export type NodeInternals = Map<string, Node>;

export type NodeDimensionUpdate = {
   id: string;
   nodeElement: HTMLDivElement;
   forceUpdate?: boolean;
};
