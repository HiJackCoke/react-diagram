import { Dimensions } from 'types';

export const internalsSymbol = Symbol.for('internals');

export const getDimensions = (node: HTMLDivElement): Dimensions => ({
   width: node.offsetWidth,
   height: node.offsetHeight,
});
