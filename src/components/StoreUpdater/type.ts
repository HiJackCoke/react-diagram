import { ReactDiagramProps } from 'types';

export type StoreUpdaterProps = Pick<
   ReactDiagramProps,
   'nodes' | 'onNodesChange' | 'edges' | 'onEdgesChange' | 'gridStep'
> & {
   rfId: string;
};
