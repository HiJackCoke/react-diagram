
import { errorMessages } from '@diagram/core';
import { OnError } from '../types';

export const internalsSymbol = Symbol.for('internals');

export const onErrorWrapper =
   (onError?: OnError) =>
   (id: keyof typeof errorMessages, value = '') =>
      onError?.(id, errorMessages[id](value));

