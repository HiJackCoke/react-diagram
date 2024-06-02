import { PortElement } from './ports';

export type NodeOrigin = [number, number];

export type NodePortBounds = {
   source: PortElement[] | null;
   target: PortElement[] | null;
};
