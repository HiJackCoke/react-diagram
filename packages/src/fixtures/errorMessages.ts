export const errorMessages = {
   '001': () => 'Seems like you have not used zustand provider as an ancestor',
   '002': () =>
      'It looks like you`ve created a new nodeTypes or edgeTypes object. If this wasn`t on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.',
   '010': (nodeType: string) =>
      `Node type "${nodeType}" not found. Using fallback type "default".`,
   '020': () => 'Can`t create edge. An edge needs a source and a target.',
   '021': (id: string) => `The old edge with id=${id} does not exist.`,
};
