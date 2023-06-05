import { ReactDiagramState } from 'components/ReactDiagramProvider/type';
import { EdgeTypesWrapped } from 'types';

type GraphViewEdgeProps = Pick<ReactDiagramState, 'rfId'>;

export type EdgeRendererProps = GraphViewEdgeProps & {
   edgeTypes: EdgeTypesWrapped;
};
