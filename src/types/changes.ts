import { Node, Dimensions, XYPosition } from '.';

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

export type NodeRemoveChange = {
   id: string;
   type: 'remove';
};

export type NodeAddChange<NodeData = any> = {
   item: Node<NodeData>;
   type: 'add';
};

export type NodeResetChange<NodeData = any> = {
   item: Node<NodeData>;
   type: 'reset';
};

export type NodeChange =
   | NodeDimensionChange
   | NodePositionChange
   | NodeSelectionChange
   | NodeRemoveChange
   | NodeAddChange
   | NodeResetChange;
