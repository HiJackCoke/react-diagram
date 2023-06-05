import { ComponentType, MemoExoticComponent } from 'react';

import { ReactDiagramState } from 'components/ReactDiagramProvider/type';
import { WrapEdgeProps, EdgeProps } from 'components/Edges/type';

export type EdgeTypes = { [key: string]: ComponentType<EdgeProps> };
export type EdgeTypesWrapped = {
   [key: string]: MemoExoticComponent<ComponentType<WrapEdgeProps>>;
};
export type CreateEdgeTypes = (edgeTypes: EdgeTypes) => EdgeTypesWrapped;

type GraphViewEdgeProps = Pick<ReactDiagramState, 'rfId'>;

export type EdgeRendererProps = GraphViewEdgeProps & {
   edgeTypes: EdgeTypesWrapped;
};
