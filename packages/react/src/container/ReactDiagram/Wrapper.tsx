import { useContext } from 'react';
import type { PropsWithChildren } from 'react';

import StoreContext from '../../contexts/RFStoreContext';
import ReactDiagramProvider from '../../components/ReactDiagramProvider';

function Wrapper({ children }: PropsWithChildren) {
   const isWrapped = useContext(StoreContext);

   if (isWrapped) {
      return <>{children}</>;
   }

   return <ReactDiagramProvider>{children}</ReactDiagramProvider>;
}

Wrapper.displayName = 'ReactDiagramWrapper';

export default Wrapper;
