import { createContext } from 'react';

import { createRCDStore } from '../store';

const StoreContext = createContext<ReturnType<typeof createRCDStore> | null>(
   null,
);

export const Provider = StoreContext.Provider;
export default StoreContext;
