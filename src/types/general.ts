import { NodeChange, EdgeChange } from '.';

export type OnNodesChange = (changes: NodeChange[]) => void;
export type OnEdgesChange = (changes: EdgeChange[]) => void;

export type OnError = (id: string, message: string) => void;

export type GridStep = [number, number];

export type Viewport = {
   x: number;
   y: number;
   zoom: number;
};
