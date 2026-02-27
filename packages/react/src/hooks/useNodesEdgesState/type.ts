import { CoreEdge, CoreNode, Dimensions, XYPosition } from 'cosmos-diagram';



export type NodeDimensionUpdate = {
   id: string;
   nodeElement: HTMLDivElement;
   forceUpdate?: boolean;
};

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

export type NodeAddChange<NodeType extends CoreNode = CoreNode> = {
   item: NodeType;
   type: 'add';
};

export type NodeResetChange<NodeType extends CoreNode = CoreNode> = {
   item: NodeType;
   type: 'reset';
};

export type NodeChange<NodeType extends CoreNode = CoreNode> =
   | NodeDimensionChange
   | NodePositionChange
   | NodeSelectionChange
   | NodeIntersectionChange
   | NodeRemoveChange
   | NodeAddChange<NodeType>
   | NodeResetChange<NodeType>;

export type EdgeSelectionChange = NodeSelectionChange;
export type EdgeRemoveChange = NodeRemoveChange;
export type EdgeAddChange<EdgeType extends CoreEdge = CoreEdge> = {
   item: EdgeType;
   type: 'add';
};
export type EdgeResetChange<EdgeType extends CoreEdge = CoreEdge> = {
   item: EdgeType;
   type: 'reset';
};

export type EdgeChange<EdgeType extends CoreEdge = CoreEdge> =
   | EdgeSelectionChange
   | EdgeRemoveChange
   | EdgeAddChange<EdgeType>
   | EdgeResetChange<EdgeType>;

export type OnNodesChange<NodeType extends CoreNode = CoreNode> = (
   changes: NodeChange<NodeType>[],
) => void;
export type OnEdgesChange<EdgeType extends CoreEdge = CoreEdge> = (
   changes: EdgeChange<EdgeType>[],
) => void;
