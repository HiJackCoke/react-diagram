import { Dimensions, XYPosition } from '@diagram/core';
import { Node } from '../../components/Node/type';
import { Edge } from '../../components/Edges/type';

export type NodeDimensionChange = {
   id: string;
   type: 'dimensions';
   dimensions?: Dimensions;
   updateStyle?: boolean;
   resizing?: boolean;
};

export type NodePositionChange = {
   id: string;
   type: 'position';
   position?: XYPosition;
   positionAbsolute?: XYPosition;
   dragging?: boolean;
};

export type NodeSelectionChange = {
   id: string;
   type: 'select';
   selected: boolean;
};

export type NodeIntersectionChange = {
   id: string;
   type: 'intersect';
   intersected: boolean;
};

export type NodeRemoveChange = {
   id: string;
   type: 'remove';
};

export type NodeAddChange<
   NodeData extends Record<string, unknown> = Record<string, unknown>,
> = {
   item: Node<NodeData>;
   type: 'add';
};

export type NodeResetChange<
   NodeData extends Record<string, unknown> = Record<string, unknown>,
> = {
   item: Node<NodeData>;
   type: 'reset';
};

export type NodeChange =
   | NodeDimensionChange
   | NodePositionChange
   | NodeSelectionChange
   | NodeIntersectionChange
   | NodeRemoveChange
   | NodeAddChange
   | NodeResetChange;

export type EdgeSelectionChange = NodeSelectionChange;
export type EdgeRemoveChange = NodeRemoveChange;
export type EdgeAddChange<EdgeData = any> = {
   item: Edge<EdgeData>;
   type: 'add';
};
export type EdgeResetChange<EdgeData = any> = {
   item: Edge<EdgeData>;
   type: 'reset';
};

export type EdgeChange =
   | EdgeSelectionChange
   | EdgeRemoveChange
   | EdgeAddChange
   | EdgeResetChange;

export type OnNodesChange = (changes: NodeChange[]) => void;
export type OnEdgesChange = (changes: EdgeChange[]) => void;
