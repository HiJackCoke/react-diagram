import { CoreNode, NodeDragItem } from './nodes';

export type OnDrag = (
   event: MouseEvent | TouchEvent,
   dragItems: NodeDragItem[],
   node: CoreNode,
   nodes: CoreNode[],
) => void;

export type DragUpdateParams = {
   domNode: Element;
   nodeId?: string;
   isSelectable?: boolean;
   noDragClassName?: string;
};

export type DragInstance = {
   update: (params: DragUpdateParams) => void;
   destroy: () => void;
};
