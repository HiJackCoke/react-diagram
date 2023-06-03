import { ComponentType, MemoExoticComponent } from 'react';
import { D3DragEvent, SubjectPosition } from 'd3';

import { NodeChange, EdgeChange } from '.';
import { WrapNodeProps, NodeProps } from 'components/Node/type';
import { WrapEdgeProps, EdgeProps } from 'components/Edges/type';

export type OnNodesChange = (changes: NodeChange[]) => void;
export type OnEdgesChange = (changes: EdgeChange[]) => void;

export type OnError = (id: string, message: string) => void;

export type GridStep = [number, number];

export type Viewport = {
   x: number;
   y: number;
   zoom: number;
};

export type NodeTypes = { [key: string]: ComponentType<NodeProps> };
export type NodeTypesWrapped = {
   [key: string]: MemoExoticComponent<ComponentType<WrapNodeProps>>;
};

export type EdgeTypes = { [key: string]: ComponentType<EdgeProps> };
export type EdgeTypesWrapped = {
   [key: string]: MemoExoticComponent<ComponentType<WrapEdgeProps>>;
};

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
