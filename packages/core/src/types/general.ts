import { D3DragEvent, SubjectPosition } from 'd3-drag';
import { Selection as D3Selection } from 'd3-selection';
import { XYPosition } from './utils';
import { CoreEdge } from './edges';
import { CoreNode } from './nodes';
export type PanBy = (delta: XYPosition) => void;

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

export type Viewport = XYPosition & {
   zoom: number;
};

export type D3SelectionInstance = D3Selection<
   Element,
   unknown,
   null,
   undefined
>;
export type D3ZoomHandler = (this: Element, event: any, d: unknown) => void;

export type OnBeforeDelete<
   NodeType extends CoreNode = CoreNode,
   EdgeType extends CoreEdge = CoreEdge,
> = ({ nodes, edges }: { nodes: NodeType[]; edges: EdgeType[] }) => Promise<
   | boolean
   | {
        nodes: NodeType[];
        edges: EdgeType[];
     }
>;

export type OnDelete<
   NodeType extends CoreNode = CoreNode,
   EdgeType extends CoreEdge = CoreEdge,
> = ({ nodes, edges }: { nodes: NodeType[]; edges: EdgeType[] }) => void

export type TargetElementsOptions<
   NodeType extends CoreNode = CoreNode,
   EdgeType extends CoreEdge = CoreEdge,
> =
   | {
        nodes: Pick<NodeType, 'id'>[];
        edges?: Pick<EdgeType, 'id'>[];
     }
   | {
        nodes?: Pick<NodeType, 'id'>[];
        edges: Pick<EdgeType, 'id'>[];
     };
